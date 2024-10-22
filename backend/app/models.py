# models.py
from app.login import login_manager
from app.database import db
from flask_login import UserMixin
from sqlalchemy.sql import func

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150))
    is_verified = db.Column(db.Boolean, default=False)
    google_id = db.Column(db.String(150), unique=True)
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    time_subscribed = db.Column(db.DateTime(timezone=True))


class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(150), index=True)
    status = db.Column(db.String(150))
    output = db.Column(db.Text)
    error = db.Column(db.Text)
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())
