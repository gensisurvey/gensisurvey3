import React, { useRef, useEffect, useState } from "react";
import "./LadderSlide.css";
import LadderMini from "./LadderMini.js";
import { max } from "d3";

const LadderSlide = ({
  promptText,
  promptText2,
  nodeNames,
  updateCurrentSelection,
  maxNom,
  id,
}) => {
  const [allLadderData, setAllLadderData] = useState(
    Array.from({ length: nodeNames.length }, () => null)
  );

  useEffect(() => {
    if (nodeNames.reduce((total, current) => total + current, 0) === -11) {
      updateCurrentSelection({
        key: id,
        data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        override: true,
        nextBlocked: false,
      });
    } else {
      const outputData = Array(maxNom + 1).fill(0);
      for (let i = 0; i < nodeNames.length; i++) {
        outputData[i] = 0;
      }
      outputData[maxNom] = 0;
      for (let i = nodeNames.length; i < maxNom; i++) {
        outputData[i] = null;
      }
      console.log(outputData);

      updateCurrentSelection({
        key: id,
        data: outputData,
        override: false,
        nextBlocked: true,
      }); // Check if this line is correct
    }
  }, []);

  const handleUpdate = (ladderRung, index) => {
    const updatedData = [...allLadderData];
    updatedData[index] = ladderRung; // Update the value at the specified index (index)
    console.log(updatedData);

    setAllLadderData(updatedData);
    // updateCurrentSelection(updatedData); // Check if this line is correct

    if (updatedData === null) {
      updateCurrentSelection({
        key: id,
        data: updatedData,
        override: false,
        nextBlocked: false,
      }); // Check if this line is correct
    } else {
      const paddingCount = Math.max(0, 11 - updatedData.length);
      const paddingArray = Array(paddingCount).fill(-1);
      const paddedArray = updatedData.concat(paddingArray);

      updateCurrentSelection({
        key: id,
        data: paddedArray,
        override: false,
        nextBlocked: false,
      }); // Check if this line is correct
    }
  };

  return (
    <>
      <div className="ladder-text-wrapper">
        <h1 className="ladder-h1">{promptText}</h1>
        <h2 className="ladder-h2">{promptText2}</h2>
        {/* <h3 className="ladder-h3">{"INSTRUCTIONS: Click on the pairs that know each other, drag the nodes to make it easier to visualize"}</h3> */}
      </div>
      <div key="outer" className="mini-ladder-wrapper">
        {allLadderData.includes(null) ? (
          <div key="inner" className="mini-ladder-inner">
            {nodeNames.map(
              (name, index) =>
                (allLadderData[index] === null && name !== -1) && (
                  <div key={(index + 5) * 367} className="mini-ladder-inner">
                    {" "}
                    <div key={(index + 3) * (index + 2222)}>
                      At the top of the ladder are the people who are best off.
                      At the bottom of the ladder are the people who are worst
                      off. Which rung of the ladder best represents where you
                      think <b>{name}</b> stands on the ladder?
                    </div>
                    <LadderMini
                      person={name}
                      id={index}
                      key={index * 121343}
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
