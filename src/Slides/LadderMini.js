import React, { useRef, useEffect, useState } from "react";
import "./LadderSlide.css";

import LadderImg from "../Images/ladder.svg";

const LadderMini = ({ person, id, ladderMiniSubmit }) => {
  const [ladderRung, setLadderRung] = useState("");
  const [flash, setFlash] = useState(false); // State to toggle flashing effect

  const handleChange = (e) => {
    const current_char = e.target.value.charAt(e.target.value.length - 1);

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      setLadderRung("");
    } else if (/^[1-9]$/.test(current_char)) {
      setLadderRung(current_char);
    } else {
      setFlash(true); // Activate flashing effect when input is empty
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
  };

  return (
    <div className="ladder-mini-box">
      <div>
        At the top of the ladder are the people who are best off. At the bottom
        of the ladder are the people who are worst off. Which rung of the ladder
        best represents where you think <b>{person}</b> stands on the ladder?
      </div>
      <div>Please type a rung between 1-9</div>

      <form onSubmit={handleSubmit}>
        <div className="ladder-img-container">
          {LadderImg && (
            <img src={LadderImg} alt="Logo" className="ladder-img" />
          )}
        </div>
        <input
          className={flash ? "add-flash ladder-input" : "ladder-input"}
          type="text"
          value={ladderRung}
          onChange={handleChange}
          placeholder={"1-9"}
        />
        <button className="ladder-button" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default LadderMini;
