from app.database import db
from app.models import Job, Ec2Instance
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
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
    try:
        job = session.execute(db.select(Job).filter_by(job_id=job_id)).scalar_one()
        return job
    except Exception as e:
        print(e)
        return None

def jobs_by_user(user_id):
    jobs = session.execute(db.select(Job).filter_by(user_id=user_id)).scalars().all()
    return jobs

def jobs_by_instance_id(instance_id, status = 'processing'):
    jobs = session.execute(db.select(Job).filter_by(instance_id=instance_id, status=status)).scalars().all()
    return jobs

def update_job(job_id, status=None, command=None, instance_id=None, output=None, error=None):
    job = session.execute(db.select(Job).filter_by(job_id=job_id)).scalar_one()
    #job = Job.query.filter_by(job_id=job_id).first()
    if status:
        job.status = status
    if command:
        job.command = command
    if instance_id:
        job.instance_id = instance_id
    if output:
        job.output = output
    if error:
        job.error = error
    session.commit()

def create_ec2_instance(instance_id, region, ip_addr, status):
    ec2_instance = Ec2Instance(instance_id=instance_id, region=region, ip_addr=ip_addr, status=status)
    session.add(ec2_instance)
    session.commit()

def get_ec2_instance(instance_id):
    ec2_instance = session.execute(db.select(Ec2Instance).filter_by(instance_id=instance_id)).scalar_one()
    return ec2_instance

def get_active_ec2_instance():
    try:
        ec2_instance = session.execute(db.select(Ec2Instance).filter_by(status='active')).scalar_one()
        return ec2_instance
    except NoResultFound as e:
        return None
    
def update_ec2_instance(instance_id, status):    
    ec2_instance = session.execute(db.select(Ec2Instance).filter_by(instance_id=instance_id)).scalar_one()
    ec2_instance.status = status
    session.commit()
    