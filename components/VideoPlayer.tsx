import { Card } from 'primereact/card';
import React, { useRef } from 'react';

export interface VedioPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VedioPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    videoRef.current!.play();
  };

  return (
    <div className="p-d-flex p-jc-center p-mt-4">
      <Card
        title="Video"
        style={{ width: '600px' }}
        footer={
          <div className="p-d-flex p-jc-center">
            <button
              className="p-button p-button-rounded p-button-success"
              onClick={handlePlay}
            >
              <i className="pi pi-play" style={{ marginRight: '0.5rem' }}></i>
              Play
            </button>
          </div>
        }
      >
        <video
          ref={videoRef}
          width="100%"
          controls
          style={{ borderRadius: '8px' }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Card>
    </div>
  );
};

export default VideoPlayer;
