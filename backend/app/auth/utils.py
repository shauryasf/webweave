from flask import current_app
from flask_jwt_extended import create_access_token
from ..extensions import bcrypt

def generate_jwt(email):
    # Access JWT secret key from current app config
    secret_key = current_app.config.get('JWT_SECRET_KEY')
    return create_access_token(identity=email)

def check_password(hashed_pw, password):
    return bcrypt.check_password_hash(hashed_pw, password)
