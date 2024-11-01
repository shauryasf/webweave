from flask import Blueprint, request, jsonify
from .models import User
from .utils import generate_jwt, check_password

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
