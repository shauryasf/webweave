import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))
    JWT_TOKEN_LOCATION = ["headers"]
    DB_URL = os.getenv("DB_URL")
    DB_NAME = os.getenv("DB_NAME")
    MONGO_URI = os.getenv("DB_URL")
    VERCEL_CLIENT_ID = os.getenv("VERCEL_CLIENT_ID")
    VERCEL_CLIENT_SECRET = os.getenv("VERCEL_CLIENT_SECRET")