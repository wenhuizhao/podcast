import { Message } from 'primereact/message';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';

import api from '@/services/api';
import { downloadFile } from '@/utils/FileUtil';

import VideoPlayer from './VideoPlayer';

export interface VideoPanelProps {
  jobId: string | undefined;
  timeId: ReturnType<typeof setTimeout>;
  onClose: () => void;
}
const VideoPanel: React.FC<VideoPanelProps> = ({ jobId, onClose }) => {
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  let timeoutId: ReturnType<typeof setTimeout>;
  useEffect(() => {
    const fetchData = async () => {
      setShowProgress(true);
      try {
        const response = await api.get(`/job?job_id=${jobId}`);
        console.log(response.data);
        if (response.data.status === 'completed') {
          setVideoUrl(response.data.output);
          setShowProgress(false);
        } else if (response.data.status === 'failed') {
          setShowErrorMessage(true);
          setShowProgress(false);
        } else if (response.data.status === 'processing') {
          timeoutId = setTimeout(() => {
            fetchData();
          }, 2000); //poll job status every 2 seconds
        }
      } catch (err) {
        console.log(err);
        setShowErrorMessage(true);
        setShowProgress(false);
      }
    };
    fetchData();
  }, []);

  // const handleDownload = () => {
  //   console.log('download', videoUrl);
  //   const link = document.createElement('a');
  //   link.download = 'video.mp4';
  //   link.href = videoUrl;
  //   link.click();
  //   link.remove();
  // };

  const tryAgain = () => {
    clearTimeout(timeoutId);
    onClose();
  };
  return (
    <div className="container flex-col">
      <div className="card flex justify-content-center">
        <ProgressSpinner hidden={!showProgress} />
      </div>
      {showProgress && (
        <div>
          <Message
            severity="info"
            text="Your video is being generated. It may take a few minutes. Please keep the window open."
          />
        </div>
      )}
      <div>
        <Message
          hidden={!showErrorMessage}
          severity="error"
          text="There is an error when generating the video."
        />
      </div>
      <div className="flex">
        {videoUrl && (
          <div className="flex">
            <VideoPlayer videoUrl={videoUrl} />
            <div className="flex-col m-3">
              <Panel>
                <button
                  onClick={() => downloadFile(videoUrl)}
                  className="bg-blue-400 text-white px-2 py-3 mx-1 rounded-lg shadow hover:bg-blue-600"
                >
                  Download Video
                </button>
              </Panel>
              <Panel>
                <button
                  onClick={tryAgain}
                  className="bg-blue-700 text-white px-3 py-3 mx-3 rounded-lg shadow hover:bg-blue-800"
                >
                  Try Again
                </button>
              </Panel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPanel;
