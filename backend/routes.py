# from flask import request, jsonify, url_for, redirect, send_from_directory
# from app import app, db, bcrypt
# from models import User
# from itsdangerous import URLSafeTimedSerializer
# import os
# from werkzeug.utils import secure_filename
# import threading
# import subprocess
# from s3_util import upload_file_to_s3
# from resize_image import resize
# from file_util import generate_unique_filename
# from ffmpeg import run_ffmpeg_job
# import uuid
# from flask_login import login_user

# s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# @app.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
#     existing_user = User.query.filter_by(email=data['email']).first()
#     if existing_user:
#         return jsonify({'message': 'Email already registered.'}), 400

#     hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
#     user = User(email=data['email'], password=hashed_password)
#     db.session.add(user)
#     db.session.commit()

#     token = s.dumps(user.email, salt='email-confirm')
#     verification_url = url_for('verify_email', token=token, _external=True)
#     # Send the verification email with verification_url
#     send_email(user.email, verification_url)

#     return jsonify({'message': 'User registered. Please check your email to verify your account.'}), 201

# @app.route('/verify-email/<token>', methods=['GET'])
# def verify_email(token):
#     try:
#         email = s.loads(token, salt='email-confirm', max_age=3600)
#     except Exception:
#         return jsonify({'message': 'The confirmation link is invalid or has expired.'}), 400

#     user = User.query.filter_by(email=email).first_or_404()
#     if user.is_verified:
#         return jsonify({'message': 'Account already verified.'}), 200
#     else:
#         user.is_verified = True
#         db.session.commit()
#         return jsonify({'message': 'You have confirmed your account. Thanks!'}), 200

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     user = User.query.filter_by(email=data['email']).first()

#     if user and bcrypt.check_password_hash(user.password, data['password']):
#         if user.is_verified:
#             login_user(user)
#             return jsonify({'message': 'Logged in successfully.'}), 200
#         else:
#             return jsonify({'message': 'Please verify your email first.'}), 401
#     else:
#         return jsonify({'message': 'Invalid credentials.'}), 401

# @app.route('/reset-password', methods=['POST'])
# def reset_password_request():
#     data = request.get_json()
#     user = User.query.filter_by(email=data['email']).first()
#     if user:
#         token = s.dumps(user.email, salt='password-reset')
#         reset_url = url_for('reset_password', token=token, _external=True)
#         # Send the password reset email with reset_url
#         send_email(user.email, reset_url)
#     return jsonify({'message': 'If an account with that email exists, a password reset link has been sent.'}), 200

# @app.route('/reset-password/<token>', methods=['POST'])
# def reset_password(token):
#     try:
#         email = s.loads(token, salt='password-reset', max_age=3600)
#     except Exception:
#         return jsonify({'message': 'The password reset link is invalid or has expired.'}), 400

#     data = request.get_json()
#     user = User.query.filter_by(email=email).first_or_404()
#     hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
#     user.password = hashed_password
#     db.session.commit()
#     return jsonify({'message': 'Your password has been updated.'}), 200

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     # Check if the request contains a file part
#     if 'file' not in request.files:
#         return jsonify({'error': 'No image part in the request'}), 400

#     file = request.files['file']
#     upload_type = request.form['type']
#     print(f"upload type:{upload_type}")
#     # Check if the file is selected and allowed
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
    
#     if file and allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         uniq_filename = f'{app.config['UPLOAD_FOLDER']}/{generate_unique_filename(filename)}'
#         #output = upload_file_to_s3(file)
#         file.save(uniq_filename)
#         if upload_type == 'image':
#             resized_filename = resize(uniq_filename, 1280, 760)
#             output = f"http://localhost:5000/{resized_filename}"
#         else:
#             output = f"http://localhost:5000/{uniq_filename}"
#         # Assuming you want to return the URL of the uploaded image
#         return jsonify({'url': output}), 200
#     else:
#         return jsonify({'error': 'Invalid file type'}), 400

# @app.route('/uploads/<filename>', methods=['GET'])
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# @app.route('/downloads/<filename>', methods=['GET'])
# def download_file(filename):
#     return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)


# @app.route('/generate_video', methods=['POST'])
# def create_video():
#     """Endpoint to create a video."""
#     data = request.get_json()

#     # Extract parameters
#     audio_path = data.get('audio')
#     title = data.get('title', {})
#     title_text = title.get('text', '')
#     title_font_family = title.get('fontFamily')
#     title_font_size = title.get('fontSize')
#     title_font_color = title.get('color')
#     title_location = title.get('position')  # Should be a list or tuple [x, y]
#     description = data.get('description', {})
#     description_text = description.get('text', '')
#     description_font_family = description.get('fontFamily')
#     description_font_size = description.get('fontSize')
#     description_font_color = description.get('color')
#     description_location = description.get('position')  # Should be a list or tuple [x, y]
#     background_image_path = data.get('backgroundImageUrl')
#     waveform_color = data.get('waveformColor')

#     # Validate required parameters (omitted for brevity)

#     # Generate a unique job ID
#     job_id = str(uuid.uuid4())
#     jobs[job_id] = {'status': 'processing'}

#     # Start the ffmpeg job in a new thread
#     print(f"audio:{audio_path}, title text:{title_text}, fontfamily:{title_font_family}")
#     print(f"fontsize:{title_font_size}, fontcolr:{title_font_color}, location:{title_location}")
#     print(f"desdc text:{description_text}, font:{description_font_family}")
#     print(f"fontsize:{description_font_size}, fontcolr:{description_font_color}, location:{description_location}")
#     print(f"backgroudimagepath:{background_image_path}, waveform color:{waveform_color}")
#     sys.stdout.flush()
#     thread = threading.Thread(
#         target=run_ffmpeg_job,
#         args=(
#             jobs,
#             job_id,
#             audio_path,
#             title_text,
#             title_font_family,
#             title_font_size,
#             title_font_color,
#             title_location,
#             description_text,
#             description_font_family,
#             description_font_size,
#             description_font_color,
#             description_location,
#             background_image_path,
#             waveform_color
#         )
#     )
#     thread.start()
#     #thread.join()
#     # Return the job ID to the client
#     return jsonify({'job_id': job_id}), 200

# @app.route('/job', methods=['GET'])
# def get_job_status():
#     """Endpoint to get the status of a job."""
#     job_id = request.args.get('job_id')
#     if job_id not in jobs:
#         return jsonify({'error': 'Invalid job ID'}), 400

#     job_info = jobs[job_id]
#     return jsonify({
#         'job_id': job_id,
#         'status': job_info['status'],
#         'output': job_info.get('output'),
#         'error': job_info.get('error')
#     }), 200
