from flask import Flask
from app.database import db
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate
import os
import sys


def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') # Replace with your secret key
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost/notebookvideo'  # Replace with your DB credentials
    db.init_app(app)
    migrate = Migrate(app, db)

    # Set up upload folder and allowed extensions
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER')
    app.config['DOWNLOAD_FOLDER'] = os.getenv('DOWNLOAD_FOLDER')
    os.makedirs(os.getenv('UPLOAD_FOLDER'), exist_ok=True)
    os.makedirs(os.getenv('DOWNLOAD_FOLDER'), exist_ok=True)

    from app.routes.users import users_bp
    from app.routes.videos import videos_bp
    from app.routes.login_google import login_google_bp
    app.register_blueprint(users_bp, url_prefix='/api/v1')
    app.register_blueprint(videos_bp, url_prefix='/api/v1')
    app.register_blueprint(login_gogole_bp, url_prefix='/api/v1')

    from app.login import login_manager
    login_manager.init_app(app)

    from app.encrypt import bcrypt
    bcrypt.init_app(app)
    return app