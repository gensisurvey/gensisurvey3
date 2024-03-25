import React, { useState } from "react";
import "./NodeInputSlide.css";

const NodeInputSlide = ({
  promptText,
  promptText2,
  maxNom,
  inlineText,
  updateCurrentSelection,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [flash, setFlash] = useState(false); // State to toggle flashing effect
  const [maxItemsReached, setMaxItemsReached] = useState(false); // State to toggle flashing effect

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length >= maxNom) {
      setMaxItemsReached(true); // Activate flashing effect when maxNom is reached

      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else if (inputValue.trim() === "") {
      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else {
      setItems([...items, inputValue]);
      setInputValue("");
      updateCurrentSelection([...items, inputValue]); // Check if this line is correct
    }
  };

  return (
    <>
      <div className="node-input-text-wrapper">
        <h1 className="node-input-h1">{promptText}</h1>
        <h2 className="node-input-h2">{promptText2}</h2>
      </div>
      <form className={flash ? "add-flash" : ""} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={inlineText}
        />
        <button type="submit" onSubmit={handleSubmit}>
          Add
        </button>
      </form>
      <ul className="item-list">
        {items.map((item, index) => (
          <li key={index} id={index}>
            <b>{index + 1}. </b>{item}
          </li>
        ))}
      </ul>
      {maxItemsReached && (
        <div className="max-items-reached">
          <p>Max Items Reached</p>
        </div>
      )}
    </>
  );
};

export default NodeInputSlide;
