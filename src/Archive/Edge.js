// Edge.jsx

import React from 'react';
import './Edge.css'; // Import CSS file for styling

const Edge = ({ key, startX, startY, endX, endY }) => {
  return (
    <svg key={key} className="edge">
      <line x1={startX} y1={startY} x2={endX} y2={endY} className="line" />
    </svg>
  );
};

export default Edge;