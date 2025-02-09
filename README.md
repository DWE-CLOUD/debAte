# DebAte's Cryptoscope: Crypto Market Sentiment Analysis Tool

## Overview

DebAte's Cryptoscope is a Python-based tool designed to analyze the sentiment surrounding cryptocurrency markets using data from Twitter, Brave Browser (trending topics), and Gemini (news headlines). It combines these sources to provide a comprehensive overview of market sentiment, helping users make more informed decisions.

**Key Features:**

*   **Twitter Sentiment Analysis:** Scrapes Twitter for relevant cryptocurrency keywords, performs sentiment analysis on tweets, and provides an overall sentiment score (positive, negative, neutral).
*   **Brave Trending Topics:** Retrieves trending topics from Brave Browser to identify emerging themes and coins gaining attention.
*   **Gemini News Headline Analysis:** Scrapes news headlines from Gemini (and potentially other sources in the future) and analyzes them for sentiment.
*   **Aggregated Sentiment Score:** Combines the sentiment from all sources to generate a single, aggregated sentiment score for specific cryptocurrencies.
*   **Customizable Keywords:** Allows users to specify the cryptocurrency keywords they want to track (e.g., "Bitcoin", "Ethereum", "Solana").
*   **Data Visualization (Future Enhancement):**  Planned future development to include charts and graphs to visualize sentiment trends over time.
*   **Configuration File:** Uses a configuration file (`config.ini` or similar) for API keys and other settings, allowing for easy customization.
