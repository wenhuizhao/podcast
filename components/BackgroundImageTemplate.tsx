export interface BackgroundImage {
  url: string;
  name: string;
  thumbnail: string;
  onClick: () => void;
}

export const BackgroundImageTemplate = (backgroundImage: BackgroundImage) => {
  return (
    <div className="mt-3">
      <img
        src={backgroundImage.thumbnail}
        alt={backgroundImage.name}
        className="w-6 shadow-2"
        onClick={backgroundImage.onClick}
      />
    </div>
  );
};
