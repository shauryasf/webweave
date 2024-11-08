from flask import Blueprint, request, jsonify, current_app
from .models import User
from .utils import generate_jwt, check_password
import requests

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.find_by_email(email):
        return jsonify({'error': 'User already exists'}), 400

    User.create_user(email, password)
    token = generate_jwt(email)
    return jsonify({'token': token}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.find_by_email(email)
    if not user or not check_password(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = generate_jwt(email)
    return jsonify({'token': token}), 200

@auth_bp.route('/vercel_access_token', methods=['GET'])
def vercel_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'Code not found'}), 401
    payload = {
        "code": code,
        "client_id": current_app.config.get("VERCEL_CLIENT_ID"),
        "client_secret": current_app.config.get("VERCEL_CLIENT_SECRET"),
        "redirect_uri": "http://localhost:3000/vercel-oauth"
    }
    try:
        res = requests.post("https://api.vercel.com/v2/oauth/access_token", data=payload)
        return jsonify({'access_token': res.json()['access_token']}), 200
    except:
        return jsonify({'error': 'Vercel login failed. Try again later'}), 500