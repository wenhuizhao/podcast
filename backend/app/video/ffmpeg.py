import os
import subprocess
import traceback

def escape_text(text):
    """Escape text for use in ffmpeg drawtext filter."""
    return text.replace('\\', '\\\\').replace("'", "\\'")

def run_ffmpeg_job(jobs, job_id, audio_path, title_text, title_font_family, title_font_size, title_font_color,
                   title_location, description_text, description_font_family, description_font_size,
                   description_font_color, description_location, background_image_path, waveform_color):
    """Function to run the ffmpeg command asynchronously."""
    output_video_path = f"{os.getenv('DOWNLOAD_FOLDER')}/{job_id}.mp4"  # Adjust the output path accordingly

    try:
        # Build the filter_complex string
        filters = []

        # Waveform filter
        waveform_filter = f"[1:a]showwaves=s=1280x760:mode=line:rate=25:colors={waveform_color}[waveform]"
        filters.append(waveform_filter)

        # Overlay waveform onto background image
        overlay_filter = f"[0:v][waveform]overlay=(W-w)/2:(H-h)/2[bg_waveform]"
        filters.append(overlay_filter)

        # Drawtext filters for title and description
        prev_label = '[bg_waveform]'
        texts = [
            (title_text, title_font_family, title_font_size, title_font_color, title_location),
            (description_text, description_font_family, description_font_size, description_font_color, description_location)
        ]

        for i, (text, font_family, font_size, font_color, location) in enumerate(texts):
            x, y = location['x'], location['y']
            text_escaped = escape_text(text)
            drawtext_filter = (f"{prev_label}drawtext=text='{text_escaped}':font='{font_family}':"
                               f"fontsize={font_size}:fontcolor={font_color}:x={x}:y={y}[text{i}]")
            filters.append(drawtext_filter)
            prev_label = f'[text{i}]'

        filter_complex = ';'.join(filters)
        print(f"prev_label:{prev_label}", flush=True)
        print(f"filter_complex:{filter_complex}", flush=True)
        # Build the ffmpeg command
        command = [
            'ffmpeg',
            '-y',
            '-loop', '1',
            '-i', background_image_path,
            '-i', audio_path,
            '-filter_complex', filter_complex,
            '-map', prev_label,
            '-map', '1:a',
            '-shortest',
            output_video_path
        ]
        print(f"ffmpeg -y -loop 1 -i {background_image_path} -i {audio_path} -filter_complex {filter_complex} -map {prev_label} -map 1:a -shortest {output_video_path}", flush=True)
        # Run ffmpeg command
        subprocess.run(command, check=True)

        # Update job status
        jobs[job_id]['status'] = 'completed'
        jobs[job_id]['output'] = output_video_path

    except Exception as e:
        # Update job status with error
        jobs[job_id]['status'] = 'failed'
        jobs[job_id]['error'] = str(e)
        traceback.print_exc()
