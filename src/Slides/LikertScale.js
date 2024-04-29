import React, { useState, useEffect } from "react";
import "./LikertSlide.css"; // Import CSS file for styling

const LikertScale = ({
  question,
  possibleAnswers,
  updateCurrentSelection,
  id,
}) => {
  const [selectedOption, setSelectedOption] = useState([]);

  useEffect(() => {
    updateCurrentSelection({
      key: id,
      data: null,
      override: false,
      nextBlocked: true,
    }); // Check if this line is correct
  }, []);

  const handleOptionSelect = (option) => {
    updateCurrentSelection({
      key: id,
      data: option,
      override: false,
      nextBlocked: true,
    }); // Check if this line is correct
    setSelectedOption(option);
  };

  return (
    <div
      key={id + 17}
      className={`likert-scale-slide ${id + 17 === 0 ? "first-likert" : ""}`}
    >

      <h3 className="likert-scale-question">{question}</h3>
      <div className="likert-scale-options">
        {possibleAnswers.map((answer, i) => (
          <div
            className={`likert-option${
              selectedOption === answer ? " selected" : ""
            }`}
            onClick={() => handleOptionSelect(answer)}
            key={i*6931214}
            id={i*6931214}
          >
            {answer}
          </div>
        ))}

        {/* <div
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
        </div>*/}
      </div>
      {/* <p className="selected-option">Selected option: {selectedOption}</p> */}
    </div>
  );
};

export default LikertScale;
