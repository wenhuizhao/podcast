import os
from flask import Blueprint, url_for, redirect, request
from oauthlib.oauth2 import WebApplicationClient
import requests
from app.models import User
from flask_login import login_user
from app.database import db

login_google_bp = Blueprint('login_google', __name__)

client = WebApplicationClient(os.environ.get('GOOGLE_CLIENT_ID'))

@login_google_bp.route('/login/google', methods=['GET'])
def google_login():
    google_provider_cfg = requests.get('https://accounts.google.com/.well-known/openid-configuration').json()
    authorization_endpoint = google_provider_cfg['authorization_endpoint']

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for('login_google.google_callback', _external=True),
        scope=['openid', 'email', 'profile'],
    )
    return redirect(request_uri)

@login_google_bp.route('/login/google/callback', methods=['GET'])
def google_callback():
    code = request.args.get('code')

    google_provider_cfg = requests.get('https://accounts.google.com/.well-known/openid-configuration').json()
    token_endpoint = google_provider_cfg['token_endpoint']

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=url_for('login_google.google_callback', _external=True),
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(os.environ.get('GOOGLE_CLIENT_ID'), os.environ.get('GOOGLE_CLIENT_SECRET')),
    )
    client.parse_request_body_response(token_response.text)

    userinfo_endpoint = google_provider_cfg['userinfo_endpoint']
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    user_info = userinfo_response.json()
    unique_id = user_info['sub']
    users_email = user_info['email']

    user = User.query.filter_by(google_id=unique_id).first()
    if not user:
        user = User(google_id=unique_id, email=users_email, is_verified=True)
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect('/')  # Redirect to the home page or dashboard
