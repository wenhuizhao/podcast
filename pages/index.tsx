import { Carousel } from 'primereact/carousel';
import {
  ColorPicker,
  ColorPickerHSBType,
  ColorPickerRGBType,
} from 'primereact/colorpicker';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import {
  FileUpload,
  FileUploadFile,
  FileUploadFilesEvent,
} from 'primereact/fileupload';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

import { BackgroundImageTemplate } from '@/components/BackgroundImageTemplate';

import DraggableTextPanel, {
  FontType,
  Position,
  UpdateType,
} from '@/components/DraggableTextPanel';
import LoginPanel from '@/components/LoginPanel';
import VideoPanel from '@/components/VideoPanel';
import { WaveformTemplate } from '@/components/WaveformTemplate';
import api, { assetUrl } from '@/services/api';
import { ProgressSpinner } from 'primereact/progressspinner';

const fontFamilies = [
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Verdana',
];

export default function Home() {
  const [audioFile, setAudioFile] = useState<FileUploadFile>();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  const [waveformImageUrl, setWaveformImageUrl] = useState<string>('');
  const [waveformColor, setWaveformColor] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [showVideoPanel, setShowVideoPanel] = useState<boolean>(false);
  const [showLoginPanel, setShowLoginPanel] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string>();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  const [titleState, setTitleState] = useState<FontType>({
    fontFamily: 'Arial',
    fontSize: 20,
    color: '#000000',
  });

  const [descriptionState, setDescriptionState] = useState<FontType>({
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#000000',
  });
  let titleText: string | undefined;
  let titlePosition: Position;
  let descriptionText: string | undefined;
  let descriptionPosition: Position;

  const bgImages = [
    { name: 'bg1', url: `${assetUrl}/bg1.png` },
    { name: 'bg2', url: `${assetUrl}/bg2.png` },
    { name: 'bg3', url: `${assetUrl}/bg3.png` },
    { name: 'bg3', url: `${assetUrl}/bg4.png` },
    { name: 'bg3', url: `${assetUrl}/bg5.png` },
  ];
  const wfImages = [
    {
      name: 'waveform',
      color: 'white',
      url: `${assetUrl}/waveform1-white.png`,
    },
    {
      name: 'waveform',
      color: 'black',
      url: `${assetUrl}/waveform1-black.png`,
    },
    {
      name: 'waveform',
      color: 'blue',
      url: `${assetUrl}/waveform1-blue.png`,
    },
    {
      name: 'waveform',
      color: 'red',
      url: `${assetUrl}/waveform1-red.png`,
    },
    {
      name: 'waveform',
      color: 'orange',
      url: `${assetUrl}/waveform1-orange.png`,
    },
    {
      name: 'waveform line',
      color: 'white',
      url: `${assetUrl}/waveform2-white.png`,
    },
    {
      name: 'waveform line',
      color: 'black',
      url: `${assetUrl}/waveform2-black.png`,
    },
    {
      name: 'waveform line',
      color: 'blue',
      url: `${assetUrl}/waveform2-blue.png`,
    },
    {
      name: 'waveform line',
      color: 'red',
      url: `${assetUrl}/waveform2-red.png`,
    },
    {
      name: 'waveform line',
      color: 'orange',
      url: `${assetUrl}/waveform2-orange.png`,
    },
  ];

  const backgroundImages = bgImages.map((img) => ({
    ...img,
    onClick: () => setBackgroundImageUrl(img.url),
  }));

  const waveformImages = wfImages.map((img) => ({
    ...img,
    onClick: () => {
      setWaveformImageUrl(img.url);
      setWaveformColor(img.color);
    },
  }));

  const onAudioUpload = (event: FileUploadFilesEvent) => {
    console.log('onAudioUpload');
    setAudioFile(event.files[0]);
    uploadFile(event.files[0], 'audio');
  };

  const onImageUpload = (event: FileUploadFilesEvent) => {
    console.log('onImageUpload');
    console.log('setImageUpload', event.files[0]);
    uploadFile(event.files[0], 'image');
  };
  const uploadFile = async (filename: FileUploadFile, type: string) => {
    const formData = new FormData();
    formData.append('file', filename);
    formData.append('type', type);
    console.log('uploadfile:', filename);

    try {
      setShowProgress(true);
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data, ' type:', type);
      if (type === 'image') {
        setBackgroundImageUrl(response.data.url);
      } else if (type === 'audio') {
        console.log('setAudiolUrl to', response.data.url);
        setAudioUrl(response.data.url);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setShowProgress(false);
    }
  };
  const showToast = (
    severityValue:
      | 'success'
      | 'info'
      | 'warn'
      | 'error'
      | 'secondary'
      | 'contrast',
    summaryValue: string,
    detailValue: string
  ) => {
    toast.current!.show({
      severity: severityValue,
      summary: summaryValue,
      detail: detailValue,
    });
  };

  const handleGenerateVideo = async () => {
    // setJobId('1d46259c-9de1-406b-9efb-0419d66ae0ad');
    // setShowVideoPanel(true);
    // return;

    if (!audioFile) {
      showToast('error', 'Not Ready', `Please upload audio file!`);
      return;
    }
    console.log('handleGenerateVideo');
    try {
      const response = await api.post(
        '/generate_video',
        {
          audio: audioUrl,
          backgroundImageUrl: backgroundImageUrl,
          waveformImageUrl: waveformImageUrl,
          waveformColor: waveformColor,
          title: {
            ...titleState,
            text: titleText,
            position: {
              x: titlePosition.x * 2,
              y: (titlePosition.y + 15) * 2,
            },
          },
          description: {
            ...descriptionState,
            text: descriptionText,
            position: {
              x: descriptionPosition.x * 2,
              y: (descriptionPosition.y + 67) * 2,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Video Generated successfully:', response.data);
      setJobId(response.data.job_id);
      setShowVideoPanel(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onUpdate: (update: UpdateType) => void = ({ title, description }) => {
    //console.log('update', title, description);
    titleText = title.text;
    titlePosition = title.position;
    descriptionText = description.text;
    descriptionPosition = description.position;
  };

  const closeVideoPanel = () => {
    setShowVideoPanel(false);
  };

  const handleTitleChange = (
    field: string,
    value:
      | string
      | number
      | ColorPickerRGBType
      | ColorPickerHSBType
      | undefined
      | null
  ) => {
    console.log(field, value);
    setTitleState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleDescriptionChange = (
    field: string,
    value:
      | string
      | number
      | ColorPickerRGBType
      | ColorPickerHSBType
      | undefined
      | null
  ) => {
    setDescriptionState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  // const handleShowLogin = () => {
  //   setShowLoginPanel(true);
  // };
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header
        className="shadow-md"
        style={{
          backgroundImage:
            'radial-gradient(circle at left top, var(--primary-100), var(--primary-200))',
        }}
      >
        <nav className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">NotebookVideo</h1>
          {/* <ul className="flex space-x-8">
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
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800"
                onClick={handleShowLogin}
              >
                Login
              </a>
            </li>
          </ul> */}
        </nav>
      </header>
      <Toast ref={toast} />
      <main className="flex flex-grow flex-col container mx-auto p-2 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mt-4 mb-2">
          Transform Your Podcasts into Engaging Videos in Minutes
        </h2>
        <h4 className="text-2x font-semibold text-center text-blue-500 mb-4">
          Upload your audio, customize with waveforms and background images, and
          watch your podcasts come to life as captivating videos—ready to share
          anywhere!
        </h4>
        <div className="card flex justify-content-center">
          <ProgressSpinner hidden={!showProgress} />
        </div>
        <Panel className="bg-white shadow-md rounded-lg p-6 container flex">
          <div className="container flex">
            <div className="container flex flex-col items-center">
              <div className="container flex ">
                <div style={{ width: '640px', height: '380px' }}>
                  <DraggableTextPanel
                    onUpdate={onUpdate}
                    title={titleState}
                    description={descriptionState}
                    backgroundUrls={[waveformImageUrl, backgroundImageUrl]}
                  />
                </div>
                <Carousel
                  value={waveformImages}
                  numVisible={3}
                  numScroll={3}
                  orientation="vertical"
                  footer={<div className="text-center">waveform</div>}
                  verticalViewPortHeight="320px"
                  itemTemplate={WaveformTemplate}
                />
              </div>
              <div
                className="card flex justify-content-center"
                style={{ width: '640px' }}
              >
                <Carousel
                  value={backgroundImages}
                  numVisible={3}
                  numScroll={3}
                  header={
                    <div className="text-center">Choose background image</div>
                  }
                  itemTemplate={BackgroundImageTemplate}
                />
              </div>
              <FileUpload
                mode="basic"
                accept="image/*"
                maxFileSize={10000000}
                customUpload
                uploadHandler={onImageUpload}
                chooseLabel="Upload Background Image"
                className="w-full max-w-md"
              />
            </div>
            <div className="flex flex-col ">
              <Panel>
                <p>change title style</p>
                <div className="flex items-center">
                  <Dropdown
                    value={titleState.fontFamily}
                    onChange={(e) => handleTitleChange('fontFamily', e.value)}
                    options={fontFamilies}
                    optionLabel="name"
                    placeholder="Change font"
                    className="w-full md:w-10rem"
                  />
                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={titleState.fontSize}
                    className="opacity-50"
                    onChange={(e) =>
                      handleTitleChange(
                        'fontSize',
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                  <ColorPicker
                    value={titleState.color}
                    onChange={(e) => handleTitleChange('color', e.value)}
                  />
                </div>
              </Panel>
              <Panel>
                <p>Change description style</p>
                <div className="flex items-center">
                  <Dropdown
                    value={descriptionState.fontFamily}
                    onChange={(e) =>
                      handleDescriptionChange('fontFamily', e.value)
                    }
                    options={fontFamilies}
                    optionLabel="name"
                    placeholder="Change font"
                    className="w-full md:w-10rem"
                  />

                  <input
                    type="number"
                    min="8"
                    max="72"
                    value={descriptionState.fontSize}
                    onChange={(e) =>
                      handleDescriptionChange(
                        'fontSize',
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                  <ColorPicker
                    value={descriptionState.color}
                    onChange={(e) => handleDescriptionChange('color', e.value)}
                  />
                </div>
              </Panel>
              <div className="flex flex-col mt-5 items-center space-x-6">
                <FileUpload
                  mode="basic"
                  accept="audio/*"
                  maxFileSize={10000000}
                  customUpload
                  uploadHandler={onAudioUpload}
                  chooseLabel="Upload Audio File"
                  className=" mb-3 max-w-md"
                />
                <button
                  onClick={handleGenerateVideo}
                  className="bg-blue-700 text-white px-3 py-3 mx-3 rounded-lg shadow hover:bg-blue-800"
                >
                  Generate Video
                </button>
              </div>
            </div>
          </div>
        </Panel>
        <Dialog
          header="Generate Video"
          visible={showVideoPanel}
          style={{ width: '80vw' }}
          onHide={() => {
            if (!showVideoPanel) return;
            setShowVideoPanel(false);
          }}
        >
          <VideoPanel jobId={jobId} onClose={closeVideoPanel} />
        </Dialog>
        <Dialog
          visible={showLoginPanel}
          modal
          onHide={() => {
            if (!showLoginPanel) return;
            setShowLoginPanel(false);
          }}
          content={({}) => <LoginPanel />}
        ></Dialog>
      </main>
      <footer className="bg-white mt-auto shadow-md py-4">
        <div className="container mx-auto text-center text-blue-600">
          &copy; 2024 NotebookVideo. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
