import React, { useRef, useEffect, useState } from "react";
import "./LadderSlide.css";
import LadderMini from "./LadderMini.js";

const LadderSlide = ({
  promptText,
  promptText2,
  nodeNames,
  updateCurrentSelection,
  id
}) => {
  const [allLadderData, setAllLadderData] = useState(
    Array.from({ length: nodeNames.length }, () => null)
  );

  const handleUpdate = (ladderRung, index) => {
    const updatedData = [...allLadderData];
    updatedData[index] = ladderRung; // Update the value at the specified index (index)
    console.log(updatedData);

    setAllLadderData(updatedData);
    // updateCurrentSelection(updatedData); // Check if this line is correct

    if (updatedData === null) {
      updateCurrentSelection({key: id, data:updatedData}); // Check if this line is correct

    }
    else {
      const paddingCount = Math.max(0, 11 - updatedData.length);
      const paddingArray = Array(paddingCount).fill(-1);
      const paddedArray = updatedData.concat(paddingArray);

      updateCurrentSelection({key: id, data:paddedArray}); // Check if this line is correct

    }


    // setAllLadderData((prevState) => {
    //   const updatedData = [...prevState]; // Create a copy of the previous state array
    //   updatedData[id] = ladderRung; // Update the value at the specified index (id)
    //   console.log(updatedData);
    //   return updatedData; // Return the updated array
    // });

    // updateCurrentSelection([...items, inputValue]); // Check if this line is correct
  };

  return (
    <>
      <div className="ladder-text-wrapper">
        <h1 className="ladder-h1">{promptText}</h1>
        <h2 className="ladder-h2">{promptText2}</h2>
        {/* <h3 className="ladder-h3">{"INSTRUCTIONS: Click on the pairs that know each other, drag the nodes to make it easier to visualize"}</h3> */}
      </div>
      <div key='outer' className="mini-ladder-wrapper">
        {allLadderData.includes(null) ? (
          <div key='inner' className="mini-ladder-inner">
            {nodeNames.map(
              (name, index) =>
                allLadderData[index] === null && (
                  <div className="mini-ladder-inner">
                    {" "}
                    <div key={(index+3)*(index + 2222)}>
                      At the top of the ladder are the people who are best off.
                      At the bottom of the ladder are the people who are worst
                      off. Which rung of the ladder best represents where you
                      think <b>{name}</b> stands on the ladder?
                    </div>
                    <LadderMini
                      person={name}
                      id={index}
                      key={index*121343}
                      ladderMiniSubmit={handleUpdate}
                    />
                  </div>
                )
            )}
          </div>
        ) : (
          <div>Thank you, click next slide please</div>
        )}
      </div>
    </>
  );
};

export default LadderSlide;
