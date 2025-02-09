import requests
import json

url = "https://apis.datura.ai/desearch/ai/search"

payload = {
    "date_filter": "PAST_24_HOURS",
    "model": "ORBIT",
    "prompt": "Dogecoin",
    "response_order": "SUMMARY_FIRST",
    "streaming": True,
    "tools": ["Twitter Search"]
}
headers = {
    "Authorization": "dt_$E5IzeStyIw7wb-Yg50gV72VLUFnbHZUxCnUvmoO5geM",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers, stream=True)

# Ensure the request was successful
if response.status_code == 200:
    try:
        for line in response.iter_lines():
            if line:  # Ignore empty lines
                # Decode the line to a string
                decoded_line = line.decode('utf-8')

                # Check if the line starts with "data:"
                if decoded_line.startswith("data: "):
                    # Extract the JSON part after "data: "
                    json_string = decoded_line[len("data: "):]

                    # Try to load the line as JSON
                    try:
                        data = json.loads(json_string)

                        # Check if 'content' key exists and is a non-empty string
                        if "content" in data and data["content"] and isinstance(data["content"], str):
                            """if len(data["content"]) < 5:
                                print("Insufficient")
                            else:"""
                            x=data["content"].split()
                            if not len(x) < 3:
                                print(data["content"])
                    except json.JSONDecodeError:
                        print(f"Skipping invalid JSON: {json_string}")  # Print what it tried to decode
                        pass  # Skip lines that are not valid JSON
                else:
                    print(f"Skipping line (not 'data:'): {decoded_line}")  # Skip lines that don't start with "data:"
    except Exception as e:
        print(f"An error occurred while processing the response: {e}")
else:
    print(f"Request failed with status code: {response.status_code}")
    print(response.text)  # Print the response text for error details