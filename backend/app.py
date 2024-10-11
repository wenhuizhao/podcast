from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv, find_dotenv
from s3_util import upload_file_to_s3

app = Flask(__name__)
path = sys.path[1]+'/.env'
load_dotenv(path)
CORS(app)
# Set up upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the request contains a file part
    if 'image' not in request.files:
        return jsonify({'error': 'No image part in the request'}), 400

    image = request.files['image']

    # Check if the file is selected and allowed
    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if image and allowed_file(image.filename):
        filename = secure_filename(image)
        output = upload_file_to_s3(filename) 

        # Assuming you want to return the URL of the uploaded image
        return jsonify({'url': output}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
