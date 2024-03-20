import React, { useRef, useEffect, useState } from "react";
import "./LadderSlide.css";
import LadderMini from "./LadderMini.js";

const LadderSlide = ({
  promptText,
  promptText2,
  nodeNames,
  updateCurrentSelection,
}) => {
  const [allLadderData, setAllLadderData] = useState(
    Array.from({ length: nodeNames.length }, () => null)
  );

  const handleUpdate = (ladderRung, id) => {
    const updatedData = [...allLadderData];
    updatedData[id] = ladderRung; // Update the value at the specified index (id)
    console.log(updatedData);

    setAllLadderData(updatedData);
    updateCurrentSelection(updatedData); // Check if this line is correct

    // setAllLadderData((prevState) => {
    //   const updatedData = [...prevState]; // Create a copy of the previous state array
    //   updatedData[id] = ladderRung; // Update the value at the specified index (id)
    //   console.log(updatedData);
    //   return updatedData; // Return the updated array
    // });

    // updateCurrentSelection([...items, inputValue]); // Check if this line is correct
  };

  return (
    <div className="ladder-box">
      <div className="ladder-text-wrapper">
        <h1 className="ladder-h1">{promptText}</h1>
        <h2 className="ladder-h2">{promptText2}</h2>
        {/* <h3 className="ladder-h3">{"INSTRUCTIONS: Click on the pairs that know each other, drag the nodes to make it easier to visualize"}</h3> */}
      </div>
      <div className="mini-ladder-wrapper">
        {allLadderData.includes(null) ? (
          <div className="mini-ladder-wrapper">
            {nodeNames.map(
              (name, index) =>
                allLadderData[index] === null && (
                  <LadderMini
                    person={name}
                    id={index}
                    key={index}
                    ladderMiniSubmit={handleUpdate}
                  />
                )
            )}
          </div>
        ) : (
          <div>Thank you, click next slide please</div>
        )}
      </div>
    </div>
  );
};

export default LadderSlide;
