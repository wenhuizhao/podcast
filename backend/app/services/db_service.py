from app.database import db
from app.models import Job
from sqlalchemy.orm import sessionmaker
import os

db_host = os.getenv('DB_HOST', 'localhost')
db_username = os.getenv('DB_USERNAME', 'postgres')
db_password = os.getenv('DB_PASSWORD', 'postgres')
db_name = os.getenv('DB_NAME', 'notebookvideo')
database_url = f"postgresql://{db_username}:{db_password}@{db_host}/{db_name}"
print(f"dburl: {database_url}")
engine = db.create_engine(database_url)
Session = sessionmaker(bind=engine)
session = Session()

def create_job(job_id, status, title, user_id, session_id):
    job = Job(job_id=job_id, status=status, title=title, user_id=user_id, session_id=session_id)
    session.add(job)
    session.commit()

def get_job(job_id):
    job = session.execute(db.select(Job).filter_by(job_id=job_id)).scalar_one()
    return job

def jobs_by_user(user_id):
    jobs = session.execute(db.select(Job).filter_by(user_id=user_id)).scalars().all()
    return jobs

def update_job(job_id, status, output=None, error=None):
    job = session.execute(db.select(Job).filter_by(job_id=job_id)).scalar_one()
    #job = Job.query.filter_by(job_id=job_id).first()
    job.status = status
    job.output = output
    job.error = error
    session.commit()

