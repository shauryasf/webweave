"""
Entry point for running the WebWeave backend application.

This script initializes the Flask app using the `create_app` factory function and runs it with Socket.IO for real-time communication.

Usage:
    python run.py

The application will start in debug mode, allowing for real-time updates and debugging information.
"""

from app import create_app
from app.extensions import socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True)
