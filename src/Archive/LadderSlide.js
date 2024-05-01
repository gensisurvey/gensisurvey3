import React, { useEffect, useState } from "react";
import "./LadderSlide.css";
import LadderMini from "./LadderMini.js";

const LadderSlide = ({
  promptText,
  promptText2,
  ladderPrompt,
  nodeNames,
  updateCurrentSelection,
  maxNom,
  individual,
  id,
}) => {
  const [allLadderData, setAllLadderData] = useState(
    Array.from({ length: nodeNames.length }, () => null)
  );

  useEffect(() => {
    // console.log(nodeNames);
    if (nodeNames.reduce((total, current) => total + current, 0) === -11) {
      updateCurrentSelection({
        key: id,
        data: Array.from({ length: nodeNames.length }, () => -1),
        override: true,
        nextBlocked: false,
      });
    } else {
      const outputData = Array(nodeNames.length).fill(0);

      for (let i = nodeNames.length; i < maxNom; i++) {
        outputData[i] = null;
      }

      updateCurrentSelection({
        key: id,
        data: outputData,
        override: false,
        nextBlocked: true,
      });
    }
  }, []);

  const handleUpdate = (ladderRung, index) => {
    const updatedData = [...allLadderData];
    updatedData[index] = ladderRung; // Update the value at the specified index (index)
    // console.log(updatedData);

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
      const paddingCount = Math.max(0, nodeNames.length - updatedData.length);
      const paddingArray = Array(paddingCount).fill(-1);
      const paddedArray = updatedData.concat(paddingArray);

      updateCurrentSelection({
        key: id,
        data: paddedArray,
        override: false,
        nextBlocked: false,
      });
    }
  };

  return (
    <>
      <div
        className={
          individual ? "ladder-text-wrapper-individual" : "ladder-text-wrapper"
        }
      >
        <h1 className={individual ? "ladder-h1-individual" : "ladder-h1"}>
          {promptText}
        </h1>
        <h2 className="ladder-h2">{promptText2}</h2>
      </div>
      <div key="outer" className="mini-ladder-wrapper">
        {
        allLadderData.filter((value) => value !== null).length !==
          nodeNames.filter((value) => value !== -1).length ? (
          <div key="inner" className="mini-ladder-inner">
            {nodeNames.map(
              (name, index) =>
                allLadderData[index] === null &&
                name !== -1 && (
                  <div key={(index + 5) * 367} className="mini-ladder-inner">
                    {" "}
                    <div key={(index + 3) * (index + 2222)}>
                      {ladderPrompt}
                      Which rung of the ladder best represents where you think{" "}
                      <b>{name}</b> {individual || name === 'you' ? "stand" : "stands"} on the
                      ladder?
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
        ) : individual ? (
          <div>Thank you</div>
        ) : (
          <div>Thank you, click next slide please</div>
        )}
      </div>
    </>
  );
};

export default LadderSlide;
