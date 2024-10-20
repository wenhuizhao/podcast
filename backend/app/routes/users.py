from flask import Blueprint, request, jsonify, url_for, redirect, send_from_directory
from app.database import db
from app.models import User
from app.encrypt import bcrypt
from itsdangerous import URLSafeTimedSerializer
import os
from flask_login import login_user

users_bp = Blueprint('users', __name__)

s = URLSafeTimedSerializer(os.getenv('SECRET_KEY'))

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already registered.'}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()

    token = s.dumps(user.email, salt='email-confirm')
    verification_url = url_for('verify_email', token=token, _external=True)

    # Email content
    subject = "Email Verification"
    body_text = f"Please verify your email by clicking the link: {verification_url}"
    body_html = f"""
    <html>
    <body>
        <p>Please verify your email by clicking the link below:</p>
        <a href="{verification_url}">Verify Email</a>
    </body>
    </html>
    """

    # Send the verification email
    send_email(user.email, subject, body_text, body_html)

    return jsonify({'message': 'User registered. Please check your email to verify your account.'}), 201

@users_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except Exception:
        return jsonify({'message': 'The confirmation link is invalid or has expired.'}), 400

    user = User.query.filter_by(email=email).first_or_404()
    if user.is_verified:
        return jsonify({'message': 'Account already verified.'}), 200
    else:
        user.is_verified = True
        db.session.commit()
        return jsonify({'message': 'You have confirmed your account. Thanks!'}), 200

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        if user.is_verified:
            login_user(user)
            return jsonify({'message': 'Logged in successfully.'}), 200
        else:
            return jsonify({'message': 'Please verify your email first.'}), 401
    else:
        return jsonify({'message': 'Invalid credentials.'}), 401

@users_bp.route('/reset-password', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user:
        token = s.dumps(user.email, salt='password-reset')
        reset_url = url_for('reset_password', token=token, _external=True)

        # Email content
        subject = "Password Reset Request"
        body_text = f"Please reset your password by clicking the link: {reset_url}"
        body_html = f"""
        <html>
        <body>
            <p>Please reset your password by clicking the link below:</p>
            <a href="{reset_url}">Reset Password</a>
        </body>
        </html>
        """

        # Send the password reset email
        send_email(user.email, subject, body_text, body_html)

    return jsonify({'message': 'If an account with that email exists, a password reset link has been sent.'}), 200
    
@users_bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='password-reset', max_age=3600)
    except Exception:
        return jsonify({'message': 'The password reset link is invalid or has expired.'}), 400

    data = request.get_json()
    user = User.query.filter_by(email=email).first_or_404()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user.password = hashed_password
    db.session.commit()
    return jsonify({'message': 'Your password has been updated.'}), 200

