// cropImage.ts
import { Area } from 'react-easy-crop';

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute('crossOrigin', 'anonymous'); // Needed for cross-origin images
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.src = url;
    });

  return new Promise(async (resolve, reject) => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas not supported');
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    } catch (e) {
      reject(e);
    }
  });
};
