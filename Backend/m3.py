from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Dict
import requests
import json
import asyncio
from brave_search_python_client import BraveSearch, WebSearchRequest, NewsSearchRequest
from pydantic import BaseModel, HttpUrl #Updated
import google.generativeai as genai  # Import Gemini API library

app = FastAPI()

# API Credentials (Store securely)
DATURA_API_KEY = "dt_$E5IzeStyIw7wb-Yg50gV72VLUFnbHZUxCnUvmoO5geM"
DATURA_URL = "https://apis.datura.ai/desearch/ai/search"
BRAVE_API_KEY = "BSAptYwfK9MfZM9A7GqU_3co9FqETks"
GEMINI_API_KEY = "AIzaSyAzz-eM9Z0Dk6dAReqybE57rfhFCZVkwvY"


# --- Data Models ---
class DaturaRequest(BaseModel):
    date_filter: str = "PAST_24_HOURS"
    model: str = "ORBIT"
    prompt: str
    response_order: str = "SUMMARY_FIRST"
    streaming: bool = True
    tools: List[str] = ["Twitter Search"]


class BraveSearchResponse(BaseModel):
    title: str
    url: HttpUrl #Updated


# --- Brave Search API Fix ---
async def brave_search(query: str) -> Dict[str, List[BraveSearchResponse]]:
    """Performs concurrent web and news searches using Brave Search API."""
    brave = BraveSearch(api_key=BRAVE_API_KEY)

    try:
        web_task = brave.web(WebSearchRequest(q=query, freshness="pd"))
        news_task = brave.news(NewsSearchRequest(q=query, freshness="pd"))
        web_response, news_response = await asyncio.gather(web_task, news_task)

        # Debugging: Print raw API responses
        print("RAW Web Search Response:", web_response)
        print("RAW News Search Response:", news_response)

        # Ensure responses are valid
        web_results = []
        if web_response and hasattr(web_response, "web") and hasattr(web_response.web, "results"):
            web_results = [BraveSearchResponse(title=result.title, url=result.url) for result in
                           web_response.web.results[:5]]

        news_results = []
        if news_response and hasattr(news_response, "results"):
            news_results = [BraveSearchResponse(title=news.title, url=news.url) for news in news_response.results[:20]]

        return {"web_results": web_results, "news_results": news_results}

    except Exception as e:
        print(f"Error during Brave Search: {e}")
        return {"web_results": [], "news_results": []}  # Return empty lists on failure


# --- Gemini API Call ---
async def generate_gemini_content(prompt: str) -> str:
    """Generates content using Gemini API."""
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating content with Gemini: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")


# --- API Endpoints ---
@app.get("/brave_search", response_model=Dict[str, List[BraveSearchResponse]])
async def brave_search_endpoint(query: str):
    """Brave Search Endpoint."""
    return await brave_search(query)


@app.get("/combined_search_gemini")
async def combined_search_gemini_endpoint(query: str):
    """Performs Brave Search and uses Gemini AI to summarize results."""

    # 1. Get Brave Search data
    brave_results = await brave_search(query)
    brave_text = "\n".join([f"{res.title}: {res.url}" for res in brave_results.get("web_results", [])])

    # 2. Prepare a prompt for Gemini AI
    combined_prompt = f"""
    Here is information from Brave Search regarding the query "{query}":\n{brave_text}\n\n
    Please summarize and provide insights on this information, focusing on key trends and important details.
    """

    # 3. Get a response from Gemini AI
    gemini_response = await generate_gemini_content(combined_prompt)

    return {
        "brave_results": brave_results,  # Include raw Brave Search data
        "gemini_response": gemini_response  # Summarized response from Gemini
    }


# --- Run FastAPI ---
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)