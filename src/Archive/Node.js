import React, { useState } from 'react';
import Draggable from 'react-draggable';
import './Node.css'; // Import CSS file for styling

const Node = ({ x, y, text, onDrag }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    const temp = selected
    setSelected(!temp);
    // handleEdge(!temp)
  };

  return (
    <Draggable
      defaultPosition={{ x, y }}
      grid={[2, 2]} // Adjust grid size for easier snapping
      bounds="parent" // Restrict movement within the parent container
      onStop={(e, data) => onDrag(e)}
    >
      <div className={`node ${selected ? 'selected' : ''}`} onClick={handleClick}>
        <div className="circle"></div>
        <div className="text">{text}</div>
      </div>
    </Draggable>
  );
};

export default Node;
