// PreviousSlideButton.jsx

import React, {useState} from 'react';
import './PreviousSlideButton.css'; // Import CSS file for styling

const PreviousSlideButton = ({ goBackSlide }) => {
  const [goBack, setGoBack] = useState(false)

  const onClick = () => {
    setGoBack(!goBack)
  }

  const handleOverrideYes = () => {
    setGoBack(false)
    goBackSlide()

  }

  const handleOverrideNo = () => {
    setGoBack(false)
  }

  return (
    <div className="previous-slide-button-container">
      {goBack && 
      <div className='previous-button-wrapper'>
        <p className='previous-text-override'>Are you sure you want to go back?</p>
        <button onClick={handleOverrideYes} className='previous-override-button-y'>Yes</button>
        <button onClick={handleOverrideNo} className='previous-override-button-n'>No</button>

      </div>

      }
      <button onClick={onClick} className={goBack ? 'flash previous-slide-button' : 'previous-slide-button'}>
        Previous Slide
      </button>
    </div>
  );
};

export default PreviousSlideButton;
