from datetime import timedelta
from flask import Flask
from app.database import db
from dotenv import load_dotenv
from flask_cors import CORS
from flask_migrate import Migrate
import os
import sys
from app.constant import SESSION_EXPIRATION_IN_HOURS


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['SESSION_PERMANENT'] = True
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') # Replace with your secret key
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=SESSION_EXPIRATION_IN_HOURS) 
    # app.config['SESSION_COOKIE_SECURE'] = True  # Only send cookies over HTTPS
    # app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to the session cookie
    # app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Adjust as needed ('Strict', 'Lax', 'None')
    CORS(app, supports_credentials=True)
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    db_host = os.getenv('DB_HOST', 'localhost')
    db_username = os.getenv('DB_USERNAME', 'postgres')
    db_password = os.getenv('DB_PASSWORD', 'postgres')
    db_name = os.getenv('DB_NAME', 'notebookvideo')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{db_username}:{db_password}@{db_host}/{db_name}"  # Replace with your DB credentials
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
    app.register_blueprint(login_google_bp, url_prefix='/api/v1')

    from app.login import login_manager
    login_manager.init_app(app)

    from app.encrypt import bcrypt
    bcrypt.init_app(app)
    return app