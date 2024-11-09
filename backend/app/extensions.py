"""
Initialize Flask extensions for use in the application.

Extensions:
- `mongo` (PyMongo): Provides support for MongoDB operations.
- `bcrypt` (Bcrypt): Offers password hashing utilities.
- `jwt` (JWTManager): Enables JSON Web Token handling for authentication.
- `socketio` (SocketIO): Adds real-time bidirectional communication capabilities.
"""

from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

mongo = PyMongo()
bcrypt = Bcrypt()
jwt = JWTManager()
socketio = SocketIO()