import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

const DraggableTextPanel = ({ onUpdate, backgroundUrl }) => {
  // State for the title text box
  const [titleState, setTitleState] = useState({
    text: 'Title',
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#000000',
    position: { x: 0, y: 0 },
  });

  // State for the description text box
  const [descriptionState, setDescriptionState] = useState({
    text: 'Description',
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
    position: { x: 0, y: 100 },
  });

  // Update the parent component whenever state changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        title: titleState,
        description: descriptionState,
      });
    }
  }, [titleState, descriptionState, onUpdate]);

  // Handler for title text box changes
  const handleTitleChange = (field, value) => {
    setTitleState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handler for description text box changes
  const handleDescriptionChange = (field, value) => {
    setDescriptionState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Handler for dragging the title text box
  const handleTitleDrag = (e, data) => {
    setTitleState((prevState) => ({
      ...prevState,
      position: { x: data.x, y: data.y },
    }));
  };

  // Handler for dragging the description text box
  const handleDescriptionDrag = (e, data) => {
    setDescriptionState((prevState) => ({
      ...prevState,
      position: { x: data.x, y: data.y },
    }));
  };

  const fontFamilies = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Verdana',
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '600px',
        position: 'relative',
        border: '1px solid #ccc',
        overflow: 'hidden',
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Draggable Title Text Box */}
      <Draggable position={titleState.position} onDrag={handleTitleDrag}>
        <div style={{ position: 'absolute' }}>
          <textarea
            value={titleState.text}
            onChange={(e) => handleTitleChange('text', e.target.value)}
            style={{
              fontFamily: titleState.fontFamily,
              fontSize: `${titleState.fontSize}px`,
              color: titleState.color,
              resize: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
          <div>
            <select
              value={titleState.fontFamily}
              onChange={(e) => handleTitleChange('fontFamily', e.target.value)}
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="8"
              max="72"
              value={titleState.fontSize}
              onChange={(e) =>
                handleTitleChange('fontSize', parseInt(e.target.value, 10))
              }
            />
            <input
              type="color"
              value={titleState.color}
              onChange={(e) => handleTitleChange('color', e.target.value)}
            />
          </div>
        </div>
      </Draggable>

      {/* Draggable Description Text Box */}
      <Draggable
        position={descriptionState.position}
        onDrag={handleDescriptionDrag}
      >
        <div style={{ position: 'absolute' }}>
          <textarea
            value={descriptionState.text}
            onChange={(e) => handleDescriptionChange('text', e.target.value)}
            style={{
              fontFamily: descriptionState.fontFamily,
              fontSize: `${descriptionState.fontSize}px`,
              color: descriptionState.color,
              resize: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
          <div>
            <select
              value={descriptionState.fontFamily}
              onChange={(e) =>
                handleDescriptionChange('fontFamily', e.target.value)
              }
            >
              {fontFamilies.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
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
            <input
              type="color"
              value={descriptionState.color}
              onChange={(e) => handleDescriptionChange('color', e.target.value)}
            />
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableTextPanel;
