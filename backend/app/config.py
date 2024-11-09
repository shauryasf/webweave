"""
Configuration module for the application.

This module loads environment variables from a .env file and provides a Config class
to access these variables throughout the application.

Classes:
    Config: A class that holds configuration variables loaded from environment variables.

Attributes:
    SECRET_KEY (str): The secret key used for session management.
    JWT_SECRET_KEY (str): The secret key used for JWT token encoding and decoding.
    JWT_ACCESS_TOKEN_EXPIRES (int): The expiration time (in seconds) for JWT access tokens.
    JWT_TOKEN_LOCATION (list): The locations where JWT tokens can be found (e.g., headers).
    DB_URL (str): The URL of the database.
    DB_NAME (str): The name of the database.
    MONGO_URI (str): The MongoDB URI, same as DB_URL.
    VERCEL_CLIENT_ID (str): The client ID for Vercel integration.
    VERCEL_CLIENT_SECRET (str): The client secret for Vercel integration.
"""

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