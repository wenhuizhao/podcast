import os

logo_text='NotebookVideo.com'
logo_font='Arial'
logo_color='white'
logo_size=20
preview_time=5  #preview vidoe length in second

def escape_text(text):
    """Escape text for use in ffmpeg drawtext filter."""
    return text.replace('\\', '\\\\').replace("'", "'\''")


def generate_ffmpeg_cmd(audio_path, title_text, title_font_family, title_font_size, title_font_color,
                   title_location, description_text, description_font_family, description_font_size,
                   description_font_color, description_location, background_image_path, waveform_color,
                   preview=False):

        # Build the filter_complex string
        filters = []

        # Waveform filter
        waveform_filter = f"[1:a]showwaves=s=1280x720:mode=line:rate=25:colors={waveform_color}[waveform]"
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
        logo_filter = (f"{prev_label}drawtext=text='{logo_text}':font='{logo_font}':"
                      f"fontsize={logo_size}:fontcolor={logo_color}:x=w-tw-40:y=h-th-10[text{i+1}]")
        filters.append(logo_filter)
        prev_label = f'[text{i+1}]'
        filter_complex = ';'.join(filters)
        print(f"prev_label:{prev_label}", flush=True)
        print(f"filter_complex:{filter_complex}", flush=True)
        print(f"ffmpeg -y -loop 1 -i {background_image_path} -i {audio_path} -filter_complex {filter_complex} -map {prev_label} -map 1:a -shortest", flush=True)
        # Run ffmpeg command
        command= [
            '-y',
            '-loop', '1',
            '-i', background_image_path,
        ]
        command += ['-t', f"{preview_time}"] if preview else []
        command += [
            '-i', audio_path,
            '-filter_complex', filter_complex,
            '-map', prev_label,
            '-map', '1:a',
            '-shortest' 
        ]
        return command
