export interface BackgroundImage {
  url: string;
  name: string;
  onClick: () => void;
}

export const BackgroundImageTemplate = (backgroundImage: BackgroundImage) => {
  return (
    <div className="mt-3">
      <img
        src={backgroundImage.url}
        alt={backgroundImage.name}
        className="w-6 shadow-2"
        onClick={backgroundImage.onClick}
      />
    </div>
  );
};
