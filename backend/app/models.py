# models.py
from app.login import login_manager
from app.database import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB

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
    title = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), index=True, nullable=True)
    session_id =db.Column(db.String(150), index=True)
    status = db.Column(db.String(150))
    mode = db.Column(db.String(150))
    output = db.Column(db.Text)
    error = db.Column(db.Text)
    instance_id = db.Column(db.String(150), index=True)
    command = db.Column(JSONB)
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    time_start_process = db.Column(db.DateTime(timezone=True))
    process_host = db.Column(db.String(150))
    process_id = db.Column(db.String(150))
    user = db.relationship("User", backref="jobs")

    def to_dict(self):
        return {
            'job_id': self.job_id,
            'user_id': self.user_id,
            'title': self.title,
            'status': self.status,
            'mode': self.mode,
            'output': self.output,
            'error': self.error,
            'time_created': self.time_created.isoformat() if self.time_created else '',
            'time_updated': self.time_updated.isoformat() if self.time_updated else '',
            'time_start_process': self.time_updated.isoformat() if self.time_updated else '',
        }

class Ec2Instance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    instance_id = db.Column(db.String(150), index=True)
    status = db.Column(db.String(150))
    ip_addr = db.Column(db.String(150))
    region = db.Column(db.String(150))
    time_created = db.Column(db.DateTime(timezone=True), server_default=func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=func.now())
