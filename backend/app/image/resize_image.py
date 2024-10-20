import os
from PIL import Image

def resize(image_file, width, height):
    '''
    Resize PIL image keeping ratio and using white background.
    '''
    image_pil = Image.open(image_file, 'r')
    directory = os.path.dirname(image_file)
    basename, extension = os.path.splitext(os.path.basename(image_file))
    ratio_w = width / image_pil.width
    ratio_h = height / image_pil.height
    if ratio_w < ratio_h:
        # It must be fixed by width
        resize_width = width
        resize_height = round(ratio_w * image_pil.height)
    else:
        # Fixed by height
        resize_width = round(ratio_h * image_pil.width)
        resize_height = height
    image_resize = image_pil.resize((resize_width, resize_height), Image.Resampling.LANCZOS)
    background = Image.new('RGBA', (width, height), (255, 255, 255, 255))
    offset = (round((width - resize_width) / 2), round((height - resize_height) / 2))
    background.paste(image_resize, offset)
    background.convert('RGB')
    resized_image_file = os.path.join(directory, 'resized_'+basename+'.png')
    background.save(resized_image_file)
    return resized_image_file