import React, { useRef, useEffect, useState } from "react";
import "./LadderSlide.css";

import LadderImg from "../Images/ladder.jpg";

const LadderMini = ({ person, id, ladderMiniSubmit }) => {
  const [ladderRung, setLadderRung] = useState("");
  const [flash, setFlash] = useState(false); // State to toggle flashing effect

  const handleChange = (e) => {
    let input = e.target.value.trim();

    if (input === "10") {
      input = "10";
    } else if (input.length === 2) {
      input = input.slice(1); // Remove the first character
    } else if (input.length >= 3){
      input = input.slice(1); // Remove the first character
      input = input.slice(1); // Remove the first character

    }      

    const isValidInput = /^(10|[1-9])$/.test(input); // Updated regex

    if (isValidInput) {
      setLadderRung(input);
      setFlash(false); // Reset flash when input is valid
    } else {
      setFlash(true); // Activate flashing effect when input is invalid
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ladderRung === "") {
      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else {
      ladderMiniSubmit(ladderRung, id);
    }

    // Reset ladderRung after submission
    setLadderRung("");
  };

  return (
    <div className="ladder-mini-box">
      <div className="ladder-img-container">
        {LadderImg && <img src={LadderImg} alt="Logo" className="ladder-img" />}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className={flash ? "add-flash ladder-input" : "ladder-input"}
          type="text"
          value={ladderRung}
          onChange={handleChange}
          placeholder="1-10"
        />
        <button className="ladder-button" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default LadderMini;
