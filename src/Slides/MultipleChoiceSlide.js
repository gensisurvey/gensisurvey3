import React, { useState } from 'react';
import './MultipleChoiceSlide.css';

const MultipleChoiceSlide = ({ question, options, updateSelection }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    updateSelection(option);
  };

  return (
    <div className="slide-container">
      <h2 className="slide-question">{question}</h2>
      <ul className="option-list">
        {options.map((option, index) => (
          <li key={index} className="option-item">
            <input
              type="radio"
              id={`option-${index}`}
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionSelect(option)}
              className="option-input"
            />
            <label htmlFor={`option-${index}`} className="option-label">{option}</label>
          </li>
        ))}
      </ul>
      <p className="selected-option">Selected option: {selectedOption}</p>
    </div>
  );
};

export default MultipleChoiceSlide;
