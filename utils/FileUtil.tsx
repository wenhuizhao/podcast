export const downloadFile = (fileUrl: string, filename = 'video.mp4') => {
  console.log('download', fileUrl);
  const link = document.createElement('a');
  link.download = filename;
  link.href = fileUrl;
  link.click();
  link.remove();
};
