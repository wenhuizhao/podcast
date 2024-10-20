import React from "react";

export interface WaveformImage {
    url: string;
    name: string;
    onClick: () => void;
}

export const WaveformTemplate = (waveformImage: WaveformImage) => {
    return(
    <div className="m-3">
        <img
          src={waveformImage.url}
          alt={waveformImage.name}
          className="h-8 shadow-2"
          onClick={waveformImage.onClick}
        />
      </div>
    )
}

