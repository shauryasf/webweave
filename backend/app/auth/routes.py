from flask import Blueprint, request, jsonify, current_app
from .models import User
from .utils import generate_jwt, check_password
import requests

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    This function handles the registration of a new user by extracting the email and password
    from the JSON payload of the request. It checks if a user with the given email already exists.
    If the user exists, it returns a 400 error response. If the user does not exist, it creates
    a new user, generates a JWT token for the user, and returns the token in a 201 response.
    Returns:
        Response: A JSON response containing the JWT token if the registration is successful,
                  or an error message if the user already exists.
    """


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
    """
    Authenticates a user and generates a JWT token.
    This function retrieves the email and password from the JSON payload of the request.
    It then checks if a user with the provided email exists and if the provided password
    matches the stored password. If authentication is successful, a JWT token is generated
    and returned in the response.
    Returns:
        Response: A JSON response containing the JWT token if authentication is successful,
                  or an error message if authentication fails.
    """

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
    """
    Handles the callback from Vercel OAuth authentication.
    This function retrieves the authorization code from the request arguments,
    exchanges it for an access token from Vercel, and returns the access token
    in a JSON response.
    Returns:
        Response: A JSON response containing the access token if successful,
                  or an error message if the code is not found or the Vercel
                  login fails.
    Raises:
        401 Unauthorized: If the authorization code is not found in the request arguments.
        500 Internal Server Error: If the request to Vercel to exchange the code for an access token fails.
    """

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