import React, { useState } from "react";
import "./LikertSlide.css"; // Import CSS file for styling
import LikertScale from "./LikertScale.js";

const LikertScaleSlide = ({
  scalePrompt,
  questions,
  possibleAnswers,
  id,
  updateCurrentSelection,
}) => {
  // const [selectedOptions, setSelectedOptions] = useState(new Array(questions.length));

  // const handleOptionSelect = (index, option) => {
  //   const temp = [...selectedOptions]
  //   temp[index] = option
  //   setSelectedOptions(temp)
  //   updateCurrentSelection(temp);
  // };

  return (
    <div>
      <hr style={{ marginBottom: 20 }} />

      <h1 className="likert-scale-prompt">{scalePrompt}</h1>

      {questions.map((question, index) => (
        <>
          <LikertScale
            question={question}
            possibleAnswers={possibleAnswers}
            id={id + "_" + index.toString()}
            key={(index + 45921) * 973223}
            index={(index + 459) * 97}
            updateCurrentSelection={updateCurrentSelection}
          />
        </>
      ))}
      <hr style={{ marginTop: 20 }} />
    </div>
  );
};

export default LikertScaleSlide;
