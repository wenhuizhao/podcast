import { FileUpload } from 'primereact/fileupload';
import { Panel } from 'primereact/panel';
import { useState } from 'react';

import DraggableTextPanel from '@/components/DraggableTextPanel';

export default function Home() {
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const onAudioUpload = (event) => {
    setAudioFile(event.files[0]);
  };

  const onImageUpload = (event) => {
    setImageFile(event.files[0]);
  };

  const handleSubmit = () => {
    if (audioFile && imageFile) {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('image', imageFile);
      // Send formData to the backend to generate video
      fetch('YOUR_BACKEND_ENDPOINT', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Video generated:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const onUpdate = () => {
    console.log('update');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">
            Audio to Video Converter
          </h1>
          <ul className="flex space-x-8">
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Gallery
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Login
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-8 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Convert Audio to Video with One Click
        </h2>
        <Panel
          header="Upload Files"
          style={{ width: '1280px', height: '760px' }}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <DraggableTextPanel onUpdate={onUpdate} />
        </Panel>
        <div className="flex flex-col items-center space-y-6">
          <FileUpload
            mode="basic"
            accept="audio/*"
            maxFileSize={10000000}
            customUpload
            uploadHandler={onAudioUpload}
            chooseLabel="Upload Audio File"
            className="w-full max-w-md"
          />
          <FileUpload
            mode="basic"
            accept="image/*"
            maxFileSize={10000000}
            customUpload
            uploadHandler={onImageUpload}
            chooseLabel="Upload Background Image"
            className="w-full max-w-md"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800"
          >
            Generate Video
          </button>
        </div>
      </main>

      <footer className="bg-white mt-auto shadow-md py-4">
        <div className="container mx-auto text-center text-blue-600">
          &copy; 2024 Audio to Video Converter. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
