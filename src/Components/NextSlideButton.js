// NextSlideButton.jsx

import React from 'react';
import './NextSlideButton.css'; // Import CSS file for styling

const NextSlideButton = ({ onClick, nextBlocked }) => {

  return (
    <div className="next-slide-button-container">
      <p className="error-message">{nextBlocked && 'Do not submit nothing!'}</p>
      <button onClick={onClick} className={nextBlocked ? 'flash next-slide-button' : 'next-slide-button'}>
        Next Slide
      </button>
    </div>
  );
};

export default NextSlideButton;
