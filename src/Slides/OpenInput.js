import React, { useState, useEffect } from "react";
import "./OpenInput.css";

const MultipleChoiceSlide = ({ question, updateCurrentSelection, id }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    updateCurrentSelection({
      key: id,
      data: null,
      override: false,
      nextBlocked: true,
    }); // Check if this line is correct
  }, []);

  const handleInput = (event) => {
    const customValue = event.target.value;
    setInputValue(customValue);
    updateCurrentSelection({
      key: id,
      data: customValue,
      override: false,
      nextBlocked: false,
    });
  };

  return (
    <div className="option-input-container">
      <h2 className="option-input-question">{question}</h2>
      <input
        className="option-input-input"
        value={inputValue}
        onChange={handleInput}
      />
    </div>
  );
};

export default MultipleChoiceSlide;
