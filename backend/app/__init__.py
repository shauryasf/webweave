from flask import Flask
from .config import Config
from .extensions import mongo, bcrypt, jwt
from .auth.routes import auth_bp
from .project.routes import project_bp
from flask_cors import CORS




def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    # Initialize extensions
    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(project_bp, url_prefix='/project')

    return app
