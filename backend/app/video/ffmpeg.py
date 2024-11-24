import os
import subprocess
import traceback
from app.services.db_service import update_job
from app.services.remote_service import run_remote
from app.video.ffmpeg_cmd import generate_ffmpeg_cmd
from sqlalchemy.sql import func

run_local = os.getenv('RUN_LOCAL', 'true')


def run_ffmpeg_job(job_id, audio_path, title_text, title_font_family, title_font_size, title_font_color,
                   title_location, description_text, description_font_family, description_font_size,
                   description_font_color, description_location, background_image_path, waveform_color,
                   preview=False):
    """Function to run the ffmpeg command asynchronously."""
    ffmpeg = os.getenv('FFMPEG', 'ffmpeg')
    output_video_path = f"{os.getenv('DOWNLOAD_FOLDER')}/{job_id}.mp4"  # Adjust the output path accordingly

    try:
        command = generate_ffmpeg_cmd(audio_path, title_text, title_font_family, title_font_size, title_font_color,
                   title_location, description_text, description_font_family, description_font_size,
                   description_font_color, description_location, background_image_path, waveform_color,
                   preview)
        command_run = [ffmpeg] + command + [output_video_path]
        print(f"{' '.join(command_run)}")
        # Run ffmpeg command
        update_job(job_id=job_id, command=command)
        if run_local == 'true':
            subprocess.run(command_run, check=True)
            update_job(job_id=job_id, status = 'completed', output=output_video_path)
        else:
            run_remote(job_id)


    except Exception as e:
        # Update job status with error
        update_job(job_id=job_id, status='failed', error=str(e))
        # jobs[job_id]['status'] = 'failed'
        # jobs[job_id]['error'] = str(e)
        traceback.print_exc()

def process_ffmpeg_job(job_id, origin_commands):
    ffmpeg = os.getenv('FFMPEG', 'ffmpeg')
    output_video_path = f"{os.getenv('DOWNLOAD_FOLDER')}/{job_id}.mp4"  # Adjust the output path accordingly

    try:
        # This function generate full video. Remove -t preview_time to generate full video
        index = origin_commands.index('-t')
        if index != -1 and index + 1 < len(origin_commands):
            commands = origin_commands[:index] + origin_commands[index+2:]
        else:
            commands = origin_commands

        command_run = [ffmpeg] + [cmd for cmd in commands] + [output_video_path]
        print(f"ffmpeg {' '.join(commands)} {output_video_path}", flush=True)
        # Run ffmpeg command
        now = func.now()
        if run_local == 'true':
            update_job(job_id=job_id, status = 'processing', time_start_process=now)
            subprocess.run(command_run, check=True)
            update_job(job_id=job_id, status = 'completed', mode='full', output=output_video_path)
        else:
            update_job(job_id=job_id, status = 'processing', mode='full', output=output_video_path, time_start_process=now)
            run_remote(job_id)
        # Update job status
        print(f"done process job: {job_id}")
    except Exception as e:
        # Update job status with error
        update_job(job_id=job_id, status='failed', error=str(e))
        # jobs[job_id]['status'] = 'failed'
        # jobs[job_id]['error'] = str(e)
        traceback.print_exc()

