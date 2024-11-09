"""
This module initializes and configures the Flask application.

It sets up the application with configurations, initializes extensions, enables CORS,
registers blueprints for authentication and project management, and integrates SocketIO for real-time communication.
"""

from flask import Flask
from .config import Config
from .extensions import mongo, bcrypt, jwt, socketio
from .auth.routes import auth_bp
from .project.routes import project_bp
from .project import socketio_events
from flask_cors import CORS

def create_app():
    """
    Create and configure the Flask application.
    This function initializes the Flask application, loads configurations,
    initializes extensions (MongoDB, bcrypt, JWT, SocketIO), and registers blueprints
    for authentication and project-related routes.
    Returns:
        Flask: The configured Flask application instance.
    """
   
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(project_bp, url_prefix='/project')

    return app
