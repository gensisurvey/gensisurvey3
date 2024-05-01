import React, { useState, useEffect, useContext } from "react";
import { SelectionData } from "../SelectionData.js";

import "./OpenInput.css";

const MultipleChoiceSlide = ({ question, updateCurrentSelection, id }) => {
  const [inputValue, setInputValue] = useState("");
  const { selectionData, setSelectionData } = useContext(SelectionData);

  useEffect(() => {
    if (
      selectionData &&
      typeof selectionData === "object" &&
      selectionData.hasOwnProperty(id)
    ) {
      // selectionData is defined, is an object, and has the specified key 'id'
      setInputValue(selectionData[id]);
    } else {
      updateCurrentSelection({
        key: id,
        data: null,
        override: false,
        nextBlocked: true,
      });
    } // Check if this line is correct
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
