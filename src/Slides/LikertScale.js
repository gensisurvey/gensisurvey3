import React, { useState } from "react";
import "./LikertSlide.css"; // Import CSS file for styling

const LikertScale = ({ question, index, updateSelection }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (index, option) => {
    updateSelection(index, option);
    setSelectedOption(option);
  };

  return (
    <div key={index} className={`likert-scale-slide ${index === 0 ? 'first-likert' : ''}`}>
      <h2 className="likert-scale-question">{question}</h2>
      <div className="likert-scale-options">
        <div
          className={`likert-option${
            selectedOption === "Strongly Disagree" ? " selected" : ""
          }`}
          onClick={() => handleOptionSelect(index, "Strongly Disagree")}
        >
          Strongly Disagree
        </div>
        <div
          className={`likert-option${
            selectedOption === "Disagree" ? " selected" : ""
          }`}
          onClick={() => handleOptionSelect(index, "Disagree")}
        >
          Disagree
        </div>
        <div
          className={`likert-option${
            selectedOption === "Neutral" ? " selected" : ""
          }`}
          onClick={() => handleOptionSelect(index, "Neutral")}
        >
          Neutral
        </div>
        <div
          className={`likert-option${
            selectedOption === "Agree" ? " selected" : ""
          }`}
          onClick={() => handleOptionSelect(index, "Agree")}
        >
          Agree
        </div>
        <div
          className={`likert-option${
            selectedOption === "Strongly Agree" ? " selected" : ""
          }`}
          onClick={() => handleOptionSelect(index, "Strongly Agree")}
        >
          Strongly Agree
        </div>
      </div>
      <p className="selected-option">Selected option: {selectedOption}</p>
    </div>
  );
};

export default LikertScale;
