from flask import Blueprint, request, jsonify, url_for, redirect, send_from_directory
from app.database import db
from app.models import User
from itsdangerous import URLSafeTimedSerializer
import os
import sys
from werkzeug.utils import secure_filename
import threading
import subprocess
from app.util.s3_util import upload_file_to_s3
from app.image.resize_image import resize
from app.util.file_util import generate_unique_filename
from app.video.ffmpeg import run_ffmpeg_job
import uuid
from flask_login import login_user

videos_bp = Blueprint('videos', __name__)
jobs = {}
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'wav', 'mp3'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@videos_bp.route('/upload', methods=['POST'])
def upload_file():
    # Check if the request contains a file part
    if 'file' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    file = request.files['file']
    upload_type = request.form['type']
    print(f"upload type:{upload_type}")
    # Check if the file is selected and allowed
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        uniq_filename = f"{os.getenv('UPLOAD_FOLDER')}/{generate_unique_filename(filename)}"
        #output = upload_file_to_s3(file)
        file.save(uniq_filename)
        if upload_type == 'image':
            resized_filename = resize(uniq_filename, 1280, 720)
            output = resized_filename
        else:
            output = uniq_filename
        # Assuming you want to return the URL of the uploaded image
        return jsonify({'url': output}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@videos_bp.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    print(f"uploaded_file:{filename}, upload_folder:{os.getenv('UPLOAD_FOLDER')}")
    return send_from_directory(os.getenv('UPLOAD_FOLDER'), filename)

@videos_bp.route('/downloads/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(os.getenv('DOWNLOAD_FOLDER'), filename)


@videos_bp.route('/generate_video', methods=['POST'])
def create_video():
    """Endpoint to create a video."""
    data = request.get_json()

    # Extract parameters
    audio_path = data.get('audio')
    title = data.get('title', {})
    title_text = title.get('text', '')
    title_font_family = title.get('fontFamily')
    title_font_size = title.get('fontSize')
    title_font_color = title.get('color')
    title_location = title.get('position')  # Should be a list or tuple [x, y]
    description = data.get('description', {})
    description_text = description.get('text', '')
    description_font_family = description.get('fontFamily')
    description_font_size = description.get('fontSize')
    description_font_color = description.get('color')
    description_location = description.get('position')  # Should be a list or tuple [x, y]
    background_image_path = data.get('backgroundImageUrl')
    waveform_color = data.get('waveformColor')

    # Validate required parameters (omitted for brevity)

    # Generate a unique job ID
    job_id = str(uuid.uuid4())
    jobs[job_id] = {'status': 'processing'}

    # Start the ffmpeg job in a new thread
    print(f"audio:{audio_path}, title text:{title_text}, fontfamily:{title_font_family}")
    print(f"fontsize:{title_font_size}, fontcolr:{title_font_color}, location:{title_location}")
    print(f"desdc text:{description_text}, font:{description_font_family}")
    print(f"fontsize:{description_font_size}, fontcolr:{description_font_color}, location:{description_location}")
    print(f"backgroudimagepath:{background_image_path}, waveform color:{waveform_color}")
    sys.stdout.flush()
    thread = threading.Thread(
        target=run_ffmpeg_job,
        args=(
            jobs,
            job_id,
            audio_path,
            title_text,
            title_font_family,
            title_font_size,
            title_font_color,
            title_location,
            description_text,
            description_font_family,
            description_font_size,
            description_font_color,
            description_location,
            background_image_path,
            waveform_color
        )
    )
    thread.start()
    #thread.join()
    # Return the job ID to the client
    return jsonify({'job_id': job_id}), 200

@videos_bp.route('/job', methods=['GET'])
def get_job_status():
    """Endpoint to get the status of a job."""
    job_id = request.args.get('job_id')
    if job_id not in jobs:
        return jsonify({'error': 'Invalid job ID'}), 400

    job_info = jobs[job_id]
    return jsonify({
        'job_id': job_id,
        'status': job_info['status'],
        'output': job_info.get('output'),
        'error': job_info.get('error')
    }), 200
