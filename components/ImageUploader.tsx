// ImageUploader.tsx
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import React, { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import { getCroppedImg } from './cropImage';

interface Props {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropDialogVisible, setCropDialogVisible] = useState<boolean>(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const aspect = 16 / 9;
  //  const cropSize = { width: 640, height: 360 };

  const onSelectFile = (e: { files: File[] }) => {
    if (e.files && e.files.length > 0) {
      const file = e.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setCropDialogVisible(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const uploadFileToBackend = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    fetch('your-backend-api-endpoint', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        console.log('Upload success', response);
      })
      .catch((error) => {
        console.error('Upload error', error);
      });
  };

  const showCroppedImage = useCallback(async () => {
    try {
      console.log('showCroppedImage');
      if (!imageSrc || !croppedAreaPixels) return;

      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImageBlob);
      setCropDialogVisible(false);

      const fileName = 'cropped_image.png';
      const croppedFile = new File([croppedImageBlob], fileName, {
        type: 'image/png',
      });
      uploadFileToBackend(croppedFile);
      console.log('uploadfile:', croppedFile);
      onUpload(croppedFile);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const cropDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setCropDialogVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Crop and Upload"
        icon="pi pi-check"
        onClick={showCroppedImage}
        autoFocus
      />
    </div>
  );

  return (
    <div>
      <FileUpload
        name="demo[]"
        accept="image/*"
        customUpload
        uploadHandler={() => {}}
        onSelect={onSelectFile}
        auto={false}
        chooseLabel="Choose"
        uploadLabel="Upload"
        cancelLabel="Cancel"
        emptyTemplate={
          <p className="p-m-0">Drag and drop files here to upload.</p>
        }
      />

      <Dialog
        visible={cropDialogVisible}
        style={{ width: '700px' }}
        header="Crop Image"
        modal
        footer={cropDialogFooter}
        onHide={() => setCropDialogVisible(false)}
      >
        <div style={{ position: 'relative', width: '100%', height: 400 }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
      </Dialog>

      {croppedImage && (
        <div>
          <h5>Cropped Image:</h5>
          <img
            alt="Cropped"
            src={URL.createObjectURL(croppedImage)}
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
