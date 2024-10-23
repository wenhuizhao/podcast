export interface WaveformImage {
  url: string;
  name: string;
  thumbnail: string;
  onClick: () => void;
}

export const WaveformTemplate = (waveformImage: WaveformImage) => {
  return (
    <div className="m-3">
      <img
        src={waveformImage.thumbnail}
        alt={waveformImage.name}
        className="h-8 shadow-2"
        onClick={waveformImage.onClick}
      />
    </div>
  );
};
