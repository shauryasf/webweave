from flask import current_app
from flask_jwt_extended import create_access_token
from ..extensions import bcrypt

def generate_jwt(email):
    """
    Generate a JWT access token for a given email.
    Args:
        email (str): The email address to include in the token's identity.
    Returns:
        str: A JWT access token.
    """

    # Access JWT secret key from current app config
    secret_key = current_app.config.get('JWT_SECRET_KEY')
    return create_access_token(identity=email)

def check_password(hashed_pw, password):
    """
    Check if the provided password matches the hashed password.
    Args:
        hashed_pw (str): The hashed password.
        password (str): The plain text password to verify.
    Returns:
        bool: True if the password matches the hashed password, False otherwise.
    """

    return bcrypt.check_password_hash(hashed_pw, password)
