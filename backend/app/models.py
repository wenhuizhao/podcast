# models.py
from app.login import login_manager
from app.database import db
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150))
    is_verified = db.Column(db.Boolean, default=False)
    google_id = db.Column(db.String(150), unique=True)
