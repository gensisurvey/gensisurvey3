import React, { useState } from "react";
import "./NodeInputSlide.css";

const NodeInputSlide = ({ promptText, promptText2, maxNom, inlineText, updateCurrentSelection }) => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [flash, setFlash] = useState(false); // State to toggle flashing effect
  const [notLongEnough, setNotLongEnough] = useState(false); // State to toggle flashing effect
  
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      setNotLongEnough(true); // Activate flashing effect when input is empty
      setTimeout(() => setNotLongEnough(false), 1000); // Turn off flashing after 0.5s
    } else if (items.length >= maxNom) {
      setFlash(true); // Activate flashing effect when maxNom is reached
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else {
      setItems([...items, inputValue]);
      setInputValue('');
      updateCurrentSelection([...items, inputValue]); // Check if this line is correct
    }
  };

  return (
    <div className="node-input-slide">
      <h1 className="input-header">{promptText}</h1>
      <h2 className="input-header">{promptText2}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={inlineText}
        />
        <button type="submit" className={flash ? 'flash' : ''}>Add</button>
      </form>
      <p className="error-message">{notLongEnough && 'Do not submit nothing!'}</p>
      <p className="error-message">{flash && 'Max limit reached!'}</p>
      <h3 className="max-nom">{"(max "}{maxNom}{" nominations)"}</h3>
      <ul className="item-list">
        {items.map((item, index) => (
          <li key={index} id={index}>{index + 1}. {item}</li>
        ))}
      </ul>
    </div>
  );
};

export default NodeInputSlide;
