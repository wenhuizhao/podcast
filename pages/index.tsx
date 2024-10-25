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
import SignInPanel from '@/components/SignInPanel';
import VideoPanel from '@/components/VideoPanel';
import { WaveformTemplate } from '@/components/WaveformTemplate';
import api, { assetUrl } from '@/services/api';
import Link from 'next/link';
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
    {
      name: 'bg6',
      thumbnail: '/images/thumb_bg6.png',
      url: `${assetUrl}/bg6.png`,
    },
    {
      name: 'bg7',
      thumbnail: '/images/thumb_bg7.png',
      url: `${assetUrl}/bg7.png`,
    },
    {
      name: 'bg8',
      thumbnail: '/images/thumb_bg8.png',
      url: `${assetUrl}/bg8.png`,
    },
    {
      name: 'bg9',
      thumbnail: '/images/thumb_bg9.png',
      url: `${assetUrl}/bg9.png`,
    },
    {
      name: 'bg10',
      thumbnail: '/images/thumb_bg10.png',
      url: `${assetUrl}/bg10.png`,
    },
    {
      name: 'bg11',
      thumbnail: '/images/thumb_bg11.png',
      url: `${assetUrl}/bg11.png`,
    },
    {
      name: 'bg12',
      thumbnail: '/images/thumb_bg12.png',
      url: `${assetUrl}/bg12.png`,
    },
    {
      name: 'bg1',
      thumbnail: '/images/thumb_bg1.png',
      url: `${assetUrl}/bg1.png`,
    },
    {
      name: 'bg2',
      thumbnail: '/images/thumb_bg2.png',
      url: `${assetUrl}/bg2.png`,
    },
    {
      name: 'bg3',
      thumbnail: '/images/thumb_bg3.png',
      url: `${assetUrl}/bg3.png`,
    },
    {
      name: 'bg3',
      thumbnail: '/images/thumb_bg4.png',
      url: `${assetUrl}/bg4.png`,
    },
    {
      name: 'bg3',
      thumbnail: '/images/thumb_bg5.png',
      url: `${assetUrl}/bg5.png`,
    },
  ];
  const wfImages = [
    {
      name: 'waveform',
      color: 'white',
      thumbnail: `/images/thumb_waveform1-white.png`,
      url: `${assetUrl}/waveform1-white.png`,
    },
    {
      name: 'waveform',
      color: 'black',
      thumbnail: `/images/thumb_waveform1-black.png`,
      url: `${assetUrl}/waveform1-black.png`,
    },
    {
      name: 'waveform',
      color: 'blue',
      thumbnail: `/images/thumb_waveform1-blue.png`,
      url: `${assetUrl}/waveform1-blue.png`,
    },
    {
      name: 'waveform',
      color: 'red',
      thumbnail: `/images/thumb_waveform1-red.png`,
      url: `${assetUrl}/waveform1-red.png`,
    },
    {
      name: 'waveform',
      color: 'orange',
      thumbnail: `/images/thumb_waveform1-orange.png`,
      url: `${assetUrl}/waveform1-orange.png`,
    },
    {
      name: 'waveform line',
      color: 'white',
      thumbnail: `/images/thumb_waveform2-white.png`,
      url: `${assetUrl}/waveform2-white.png`,
    },
    {
      name: 'waveform line',
      color: 'black',
      thumbnail: `/images/thumb_waveform2-black.png`,
      url: `${assetUrl}/waveform2-black.png`,
    },
    {
      name: 'waveform line',
      color: 'blue',
      thumbnail: `/images/thumb_waveform2-blue.png`,
      url: `${assetUrl}/waveform2-blue.png`,
    },
    {
      name: 'waveform line',
      color: 'red',
      thumbnail: `/images/thumb_waveform2-red.png`,
      url: `${assetUrl}/waveform2-red.png`,
    },
    {
      name: 'waveform line',
      color: 'orange',
      thumbnail: `/images/thumb_waveform2-orange.png`,
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

  const onCancelLogin = () => {
    setShowLoginPanel(false);
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
  const handleShowLogin = () => {
    setShowLoginPanel(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white min-h-screen flex flex-col items-strech">
      <header className="shadow-md bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2">
        <nav className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center">NotebookVideo</h1>
          <ul className="flex space-x-8">
            <li>
              <Link
                href="/"
                className="text-white font-bold hover:text-blue-800"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-white font-bold hover:text-blue-800"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-white font-bold hover:text-blue-800"
                onClick={handleShowLogin}
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <Toast ref={toast} />
      <main className="flex flex-grow flex-col container mx-auto p-2 flex flex-col items-center">
        <div className="text-center mt-12 mb-4">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
            Transform Your Podcasts into Engaging Videos
          </h2>
          <p className="text-lg text-gray-600">
            Upload your audio, customize with waveforms and background images,
            and watch your podcasts come to life as captivating videos.
          </p>
        </div>
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
                  numVisible={4}
                  numScroll={4}
                  orientation="vertical"
                  footer={
                    <div className="text-center text-lg text-gray-600">
                      waveform
                    </div>
                  }
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
                  numVisible={5}
                  numScroll={5}
                  header={
                    <div className="text-center text-lg text-gray-600">
                      Choose background image
                    </div>
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
                className="w-full max-w-md custom-file-upload"
              />
            </div>
            <div className="flex flex-col ">
              <Panel>
                <p className="text-lg text-gray-600">Change title style</p>
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
                <p className="text-lg text-gray-600">
                  Change description style
                </p>
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
                  className="ml-4 mb-3 max-w-md custom-file-upload"
                />
                <button
                  onClick={handleGenerateVideo}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition"
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
          content={({}) => <SignInPanel onCancel={onCancelLogin} />}
        ></Dialog>
      </main>
    </div>
  );
}
