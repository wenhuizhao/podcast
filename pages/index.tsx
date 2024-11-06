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
import { bgImages, wfImages } from '@/components/Images';

import DraggableTextPanel, {
  FontType,
  Position,
  UpdateType,
} from '@/components/DraggableTextPanel';
import Footer from '@/components/Footer';
import Header, { CustomClaim } from '@/components/Header';
import SignInPanel from '@/components/SignInPanel';
import VideoPanel from '@/components/VideoPanel';
import { WaveformTemplate } from '@/components/WaveformTemplate';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { User } from '@/types/User';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';

const fontFamilies = [
  'Arial',
  'Courier New',
  'Georgia',
  'Times New Roman',
  'Verdana',
];

const Home = () => {
  const [audioFile, setAudioFile] = useState<FileUploadFile>();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  const [waveformImageUrl, setWaveformImageUrl] = useState<string>('');
  const [waveformColor, setWaveformColor] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [showVideoPanel, setShowVideoPanel] = useState<boolean>(false);
  const [showLoginPanel, setShowLoginPanel] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string>();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const { setUser } = useAuth();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const searchParam = useSearchParams();
  console.log('home searchParam', searchParam.get('token'));
  const token = searchParam.get('token');
  if (token) {
    const decoded = jwtDecode<CustomClaim>(token);
    // Check token expiration
    if (decoded.exp * 1000 > Date.now()) {
      localStorage.setItem('token', token || '');
      const user: User = {
        userId: decoded.user_id,
        email: decoded.email,
      };
      setUser(user);
    } else {
      // Token has expired
      localStorage.removeItem('token');
    }
    router.push('/');
  }

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
  const uploadFile = async (filename: FileUploadFile, type = 'image') => {
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

    if (!audioFile || audioFile.name == '') {
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
  const onLogin = () => {
    setShowLoginPanel(false);
    router.push('/');
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
    console.log('showlogin');
    setShowLoginPanel(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white min-h-screen flex flex-col items-strech">
      <Header showLogin={handleShowLogin} />
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
                mode="advanced"
                accept="image/*"
                maxFileSize={10000000}
                customUpload
                uploadHandler={onImageUpload}
                chooseLabel="Choose Background Image"
                removeIcon="pi pi-trash"
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
                  mode="advanced"
                  accept="audio/*"
                  maxFileSize={10000000}
                  customUpload
                  uploadHandler={onAudioUpload}
                  chooseLabel="Choose Audio File"
                  removeIcon="pi pi-trash"
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
          content={({}) => (
            <SignInPanel onCancel={onCancelLogin} onLogin={onLogin} />
          )}
        ></Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
