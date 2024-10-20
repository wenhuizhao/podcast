import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker } from 'primereact/colorpicker';
import { InputNumber } from 'primereact/inputnumber';

const DraggableTextPanel = ({ onUpdate, title, description, backgroundUrls }) => {
  // State for the title text box
  const [titleState, setTitleState] = useState({
    text: null,
    position: { x: 100, y: 10 },
  });

  // State for the description text box
  const [descriptionState, setDescriptionState] = useState({
    text: null,
    position: { x: 100, y: 100 },
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
  const handleTitleChange = (value) => {
    setTitleState((prevState) => ({
      ...prevState,
      text: value,
    }));
  };

  // Handler for description text box changes
  const handleDescriptionChange = (value) => {
    setDescriptionState((prevState) => ({
      ...prevState,
      text: value,
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


  return (
    <div
      style={{
        width: '640px',
        height: '380px',
        position: 'relative',
        border: '1px solid #ccc',
        overflow: 'hidden',
        backgroundImage: backgroundUrls ? `url(${backgroundUrls[0]}), url(${backgroundUrls[1]})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Draggable Title Text Box */}
      <Draggable position={titleState.position} onDrag={handleTitleDrag}>
        <div >
          <textarea
            placeholder='Your title here'
            value={titleState.text}
            onChange={(e) => handleTitleChange(e.target.value)}
            style={{
              fontFamily: title.fontFamily,
              fontSize: `${title.fontSize}px`,
              color: `#${title.color}`,
              resize: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </Draggable>

      {/* Draggable Description Text Box */}
      <Draggable
        position={descriptionState.position}
        onDrag={handleDescriptionDrag}
      >
        <div >
          <textarea
            placeholder='Your description here'
            value={descriptionState.text}
            onChange={(e) => handleDescriptionChange( e.target.value)}
            style={{
              fontFamily: description.fontFamily,
              fontSize: `${description.fontSize}px`,
              color: `#${description.color}`,
              resize: 'none',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </Draggable>
    </div>
  );
};

export default DraggableTextPanel;
