from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
import requests
import json
import asyncio
import traceback  # Import traceback module
from brave_search_python_client import BraveSearch, WebSearchRequest, NewsSearchRequest
from pydantic import BaseModel
import google.generativeai as genai  # Import the Gemini API library
import logging  # Import the logging module

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


app = FastAPI()

# API Credentials (Ideally, store these securely using environment variables)
DATURA_API_KEY = "dt_$E5IzeStyIw7wb-Yg50gV72VLUFnbHZUxCnUvmoO5geM"  # Replace with your actual API key
DATURA_URL = "https://apis.datura.ai/desearch/ai/search"
BRAVE_API_KEY = "BSAptYwfK9MfZM9A7GqU_3co9FqETks"  # Replace with your actual API key
GEMINI_API_KEY = "AIzaSyAzz-eM9Z0Dk6dAReqybE57rfhFCZVkwvY"  # Replace with your Gemini API key

# --- Data Models for Request Bodies ---
class DaturaRequest(BaseModel):
    date_filter: str = "PAST_24_HOURS"
    model: str = "ORBIT"
    prompt: str
    response_order: str = "SUMMARY_FIRST"
    streaming: bool = True
    tools: List[str] = ["Twitter Search"]

class BraveSearchResponse(BaseModel):
    title: str
    url: str

# --- Helper Functions ---

async def datura_stream(datura_request: DaturaRequest):
    """Streams data from the Datura AI API."""

    headers = {
        "Authorization": DATURA_API_KEY,
        "Content-Type": "application/json"
    }

    try:
        response = requests.request("POST", DATURA_URL, json=datura_request.dict(), headers=headers, stream=True)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Datura AI API request failed: {response.text}")

        async def event_stream():
            try:
                for line in response.iter_lines():
                    if line:  # Ignore empty lines
                        decoded_line = line.decode('utf-8')

                        if decoded_line.startswith("data: "):
                            json_string = decoded_line[len("data: "):]
                            try:
                                data = json.loads(json_string)
                                if "content" in data and data["content"] and isinstance(data["content"], str):
                                    x = data["content"].split()
                                    if not len(x) < 3:
                                        yield data['content']  # Return just the content string

                            except json.JSONDecodeError as e:
                                logging.error(f"JSONDecodeError in datura_stream: {e}, json_string={json_string}")
                                yield f"Error: JSON Decode Error - {e}"  # Send error to client

                        else:
                            logging.warning(f"Skipping line (not 'data:'): {decoded_line}")

            except Exception as e:
                logging.exception(f"An error occurred in datura_stream: {e}")
                yield f"Error: {e}"  # Send error to client

            finally:
                response.close()  # Ensure connection is closed

        # Collect stream data into a list
        data_list = []
        async for item in event_stream():
            data_list.append(item)

        return data_list


    except Exception as e:
        logging.exception(f"Error calling Datura AI API: {e}")
        raise HTTPException(status_code=500, detail=f"Error calling Datura AI API: {e}")



async def brave_search(query: str) -> Dict[str, List[BraveSearchResponse]]:
    """Performs web and news searches using the Brave Search API."""
    brave = BraveSearch(api_key=BRAVE_API_KEY)
    try:
        web_response = await brave.web(WebSearchRequest(q=query, freshness="pd"))
        news_response = await brave.news(NewsSearchRequest(q=query, freshness="pd"))

        web_results = [BraveSearchResponse(title=result.title, url=result.url) for result in web_response.web.results[:5]]
        news_results = [BraveSearchResponse(title=news.title, url=news.url) for result in news_response.results[:20]]

        return {"web_results": web_results, "news_results": news_results}

    except Exception as e:
        logging.exception(f"Error during Brave Search: {e}")
        return {"web_results": [], "news_results": []}  # Return empty lists in case of error


async def generate_gemini_content(prompt: str) -> str:
    """Generates content using the Gemini API."""

    try:
        genai.configure(api_key=GEMINI_API_KEY) # Configure Gemini API
        model = genai.GenerativeModel('gemini-pro')

        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logging.exception(f"Error generating content with Gemini: {e}")
            raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")
    except Exception as e:
        logging.error(f"Gemini configuration error: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini configuration error: {e}")


# --- API Endpoints ---

@app.post("/datura_search")
async def datura_search_endpoint(datura_request: DaturaRequest):
    """Endpoint to perform a Datura AI search and return the data."""
    data = await datura_stream(datura_request)
    return {"data": data}


@app.get("/brave_search", response_model=Dict[str, List[BraveSearchResponse]])
async def brave_search_endpoint(query: str):
    """Endpoint to perform a Brave Search."""
    try:
        return await brave_search(query)
    except Exception as e:
        logging.exception(f"Brave Search Endpoint error: {e}")  # Log the exception
        raise HTTPException(status_code=500, detail=str(e))  # Return an HTTP error


@app.get("/combined_search_gemini")
async def combined_search_gemini_endpoint(query: str):
    """Endpoint to perform Datura, Brave searches, combine results, and use Gemini."""

    try:
        # 1. Get data from Datura AI
        datura_request = DaturaRequest(prompt=query)
        datura_data = await datura_stream(datura_request)
        datura_text = "\n".join(datura_data)  # Join into a single string

        # 2. Get data from Brave Search
        brave_results = await brave_search(query)
        brave_text = ""
        for result_type, results in brave_results.items():
            for result in results:
                brave_text += f"{result.title}: {result.url}\n"

        # 3. Combine the data into a single prompt for Gemini
        combined_prompt = f"""
        Here is information from Datura AI regarding the query "{query}":\n{datura_text}\n\n
        Here is information from Brave Search regarding the query "{query}":\n{brave_text}\n\n
        Please summarize and provide insights on this information, focusing on key trends and important details.
        """

        # 4. Send the combined prompt to Gemini and get the response
        gemini_response = await generate_gemini_content(combined_prompt)

        return {
            "datura_data": datura_data,  # Include the raw Datura data if needed
            "brave_results": brave_results,  # Include the raw Brave results if needed
            "gemini_response": gemini_response  # Return the Gemini-generated content
        }
    except Exception as e:
        logging.exception(f"Combined search endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)