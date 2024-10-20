import os
import time
import uuid

def generate_unique_filename(filename):
    """Generates a unique filename by appending a timestamp and UUID."""
    base, ext = os.path.splitext(filename)
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    unique_id = uuid.uuid4().hex[:6]
    return f"{base}-{timestamp}-{unique_id}{ext}"