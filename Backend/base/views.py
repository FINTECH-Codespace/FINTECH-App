#
# This file contains the view functions for the Fintech Django application.
# Each function handles a specific API endpoint for retrieving financial data,
# such as stock prices, market news, and top-performing stocks.
#
import json
import os
from pathlib import Path
from datetime import timedelta, datetime

from dotenv import load_dotenv
from nsepython import nse_eq  # Library for fetching data from the National Stock Exchange (NSE)
import requests
from django.http import JsonResponse
from .utils import get_home_loans_data
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))
# Instead of hardcoding them, they should be loaded from environment variables.
# The os.getenv() function safely retrieves them. A default key can be provided for development.
FINNHUB_API_KEY = os.getenv('FINNHUB_API_KEY')
MARKETAUX_API_KEY = os.getenv('MARKETAUX_API_KEY')
NEWS_GENERAL_API_KEY = os.getenv('NEWS_GENERAL_API')
api_key = os.getenv('ALPHA_VANTAGE_API_KEY')
def metal_price(request):
    symbol = request.GET.get('name','GLD')
    url1 = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}'
    try:
        response = requests.get(url1)
        response.raise_for_status()
        data = response.json()
        return JsonResponse(data)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)
def top_stocks(request):
    """
    Fetches the list of top gainers from the NSE India website.
    It simulates a browser request to access the NSE's public API.

    Returns:
        JsonResponse: A JSON object with the top gainers' data or an error message.
    """
    url = "https://www.nseindia.com/api/live-analysis-variations?index=gainers"

    # NSE's API requires specific headers to prevent being blocked.
    # This mimics a request from a web browser.
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.nseindia.com/"
    }

    try:
        # A session is used to persist cookies, which is required by the NSE website.
        session = requests.Session()
        # First, visit the main page to initialize the session and get necessary cookies.
        session.get("https://www.nseindia.com", headers=headers)

        # Now, make the actual API call to get the top gainers.
        response = session.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return JsonResponse(data)
    except requests.RequestException as e:
        # Handle any request-related errors.
        return JsonResponse({'error': f'Failed to fetch data from NSE: {e}'}, status=500)
def stock_details(request):
    """
    Fetches comprehensive details for a given international stock symbol from Finnhub.
    This includes the latest quote, company profile, and recent news.

    Request Body (JSON):
        - name (str): The stock symbol (e.g., 'AAPL'). Defaults to 'AAPL'.

    Returns:
        JsonResponse: A JSON object containing aggregated stock data or an error message.
    """
    if request.method == 'GET':
        try:
            # Extract the symbol from the request body. Default to 'AAPL'.
            body = json.loads(request.body.decode('utf-8')) if request.body else {}
            symbol = body.get('name', 'AAPL')

            # --- Fetch data from three different Finnhub endpoints ---

            # 1. Get the latest stock quote.
            url_stock = f"https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}"
            stock_quote = requests.get(url_stock).json()

            # 2. Get the company's profile information.
            url_profile = f"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={FINNHUB_API_KEY}"
            profile = requests.get(url_profile).json()

            # 3. Get company news from the last 7 days.
            today = datetime.today().strftime('%Y-%m-%d')
            last_week = (datetime.today() - timedelta(days=7)).strftime('%Y-%m-%d')
            url_news = f"https://finnhub.io/api/v1/company-news?symbol={symbol}&from={last_week}&to={today}&token={FINNHUB_API_KEY}"
            news_res = requests.get(url_news).json()

            # Combine all fetched data into a single response object.
            data = {
                'stocks': stock_quote,
                'profile': profile,
                'news': news_res
            }
            return JsonResponse(data)

        except Exception as e:
            # Catch all other potential errors (e.g., JSON decoding issues, API errors).
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only GET method allowed'}, status=405)
def indian_stocks(request):
    """
    Fetches details and news for a given Indian stock symbol (NSE).
    Uses the nsepython library for stock data and MarketAux for news.

    Query Parameters:
        - symbol (str): The NSE stock symbol (e.g., 'RELIANCE'). Defaults to 'RELIANCE'.

    Returns:
        JsonResponse: A JSON object with the stock info and related news or an error message.
    """
    if request.method == 'GET':
        try:
            symbol = request.GET.get('symbol', 'RELIANCE')

            # Fetch stock data from NSE using the nsepython library.
            try:
                stock_data = nse_eq(symbol)
                if not stock_data:
                    return JsonResponse({'error': 'Invalid symbol or no data found for symbol'}, status=404)
            except Exception as e:
                return JsonResponse({'error': f'Failed to fetch NSE data: {e}'}, status=500)

            # Structure the stock information into a cleaner format.
            stock_info = {
                "symbol": stock_data.get('info', {}).get('symbol'),
                "companyName": stock_data.get('info', {}).get('companyName'),
                "lastPrice": stock_data.get('priceInfo', {}).get('lastPrice'),
                "dayHigh": stock_data.get('priceInfo', {}).get('intraDayHighLow', {}).get('max'),
                "dayLow": stock_data.get('priceInfo', {}).get('intraDayHighLow', {}).get('min'),
                "previousClose": stock_data.get('priceInfo', {}).get('previousClose'),
                "change": stock_data.get('priceInfo', {}).get('change'),
                "pChange": stock_data.get('priceInfo', {}).get('pChange')
            }

            # Fetch related news from the MarketAux API.
            # Append .NS to the symbol for better accuracy with international APIs.
            symbol_full = f"{symbol}.NS"
            news_url = f"https://api.marketaux.com/v1/news/all?symbols={symbol_full}&countries=in&language=en&api_token={MARKETAUX_API_KEY}"
            news_res = requests.get(news_url)
            news_data = news_res.json().get('data', [])

            # Combine stock and news data for the final response.
            return JsonResponse({
                "stock": stock_info,
                "news": news_data
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # If the request method is not GET, return None, which will result in an error.
    # A more explicit response is better.
    return JsonResponse({'error': 'Only GET method allowed'}, status=405)
def general_news(request):
    """
    Fetches top business headlines from India using the NewsAPI.

    Returns:
        JsonResponse: A JSON object containing a list of news articles or an error message.
    """
    # Construct the URL for NewsAPI's top headlines' endpoint.
    url = f"https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey={NEWS_GENERAL_API_KEY}"

    try:
        # Make the GET request.
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return JsonResponse(data)
    except requests.RequestException as e:
        # Handle request-related errors.
        return JsonResponse({'error': f'Failed to fetch news: {e}'}, status=500)
def silver_price(request):
    symbol = 'XAG'
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}'
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return JsonResponse(data)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)

def home_loan_rates(request):
    file_path = "C:\\Users\\Hp\\Downloads\\home_loan_interest_history.xlsx"
    data = get_home_loans_data(file_path)
    return JsonResponse(data, safe=False)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/",
    "Connection": "keep-alive",
}

def search_stock(request):
    """
    Handles stock search using NSE India's autocomplete API.
    
    Workflow:
    1. Get the search query from the request (parameter `q`).
    2. If query is empty, return an empty JSON response.
    3. Make a session request to NSE India homepage to initialize cookies (required by NSE API).
    4. Call NSE's autocomplete API: https://www.nseindia.com/api/search/autocomplete?q=<query>.
    5. Extract relevant fields (symbol and name) from the response.
    6. Return a JSON array of matching stocks.

    Request:
        GET /search_stock?q=<search_text>

    Query Parameters:
        q (string): Stock symbol or company name to search for.

    Response:
        JSON array of objects:
        [
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Limited"
            },
            ...
        ]
    """
    query = request.GET.get("q", "").strip()
    if not query:
        return JsonResponse([], safe=False)

    url = f"https://www.nseindia.com/api/search/autocomplete?q={query}"
    session = requests.Session()
    session.headers.update(HEADERS)

    try:
        # Initialize cookies by visiting NSE homepage
        session.get("https://www.nseindia.com", timeout=10)

        # Call the API
        response = session.get(url, timeout=10)

        # Debug logs
        print("Status Code:", response.status_code)
        print("Raw Response (first 300 chars):", response.text[:300])

        # If response is not JSON, return error message
        try:
            data = response.json()
        except ValueError:
            return JsonResponse({"error": "Invalid response from NSE API"}, status=502)

        # Extract symbols - handle possible changes in API response structure
        symbols_list = data.get("symbols", data.get("data", []))

        # Prepare results
        results = [
            {"symbol": item.get("symbol"), "name": item.get("name")}
            for item in symbols_list
            if item.get("symbol") and item.get("symbol") != "-"
        ]

        return JsonResponse(results, safe=False)

    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"Request failed: {str(e)}"}, status=500)





