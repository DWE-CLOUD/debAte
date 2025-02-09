import os
import asyncio
from brave_search_python_client import BraveSearch, WebSearchRequest, NewsSearchRequest

api_key = "BSAptYwfK9MfZM9A7GqU_3co9FqETks"
brave = BraveSearch(api_key=api_key)

l1=[]

async def search_brave(query):
    web_response = await brave.web(WebSearchRequest(q=query, freshness="pd"))  # 'd1' = 1 day

    news_response = await brave.news(NewsSearchRequest(q=query, freshness="pd"))

    print("\nWeb Search Results:")
    for result in web_response.web.results[:5]:  # Limiting to first 5 results
        a=f"{result.title} - {result.url}"
        l1.append(a)

    print("\nNews Search Results:")
    for news in news_response.results[:20]:  # Use .results directly instead of news.results
        b=f"{news.title} - {news.url}"
        l1.append(b)



# Run the async function
asyncio.run(search_brave("Doge Coin"))


