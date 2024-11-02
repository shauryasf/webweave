from flask import Flask
from .config import Config
from .extensions import mongo, bcrypt, jwt, socketio
from .auth.routes import auth_bp
from .project.routes import project_bp
from .project import socketio_events
from flask_cors import CORS





def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(project_bp, url_prefix='/project')

    return app
