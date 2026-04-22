import os 
from dotenv import load_dotenv
load_dotenv()
print(os.getenv('FINNHUB_API_KEY'))