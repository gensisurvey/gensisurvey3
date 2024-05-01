import React, { useState, useEffect, useContext } from "react";
import { SelectionData } from "../SelectionData.js";
import "./MultipleChoiceSlide.css";

const MultipleChoiceSlide = ({
  question,
  options,
  add_other_option,
  checkbox,
  updateCurrentSelection,
  id,
}) => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [otherSelected, setOtherSelected] = useState(false);
  const [otherValue, setOtherValue] = useState("Other");
  const { selectionData, setSelectionData } = useContext(SelectionData);

  useEffect(() => {
    if (
      selectionData &&
      typeof selectionData === "object" &&
      selectionData.hasOwnProperty(id)
    ) {
      if (!checkbox && add_other_option && !options.includes(selectionData[id])) {
        setSelectedOption(selectionData[id]);
        setOtherSelected(true)
      } else if (checkbox && add_other_option) {
        const newItems = []
        for (let item of selectionData[id]) {
          if (!options.includes(item)) {
            setOtherSelected(true)
            setOtherValue(item)
          }
          newItems.push(item)
        }

        setSelectedOption(newItems);

      } else {
        setSelectedOption(selectionData[id]);
      }


    } else {
      updateCurrentSelection({
        key: id,
        data: null,
        override: false,
        nextBlocked: true,
      }); // Check if this line is correct
    }
  }, []);

  const handleOptionSelectNormal = ([choice, other_bool]) => {
    if (other_bool) {
      setOtherSelected(true);
    } else {
      setOtherSelected(false);
    }

    setSelectedOption(choice);
    updateCurrentSelection({
      key: id,
      data: choice,
      override: false,
      nextBlocked: false,
    });
  };

  const handleCustomInputChangeNormal = (event) => {
    const customValue = event.target.value;
    setSelectedOption(customValue);
    updateCurrentSelection({
      key: id,
      data: customValue,
      override: false,
      nextBlocked: false,
    });
  };

  const handleOptionSelectCheckBox = (choice) => {
    let newSelected = [...selectedOption];
    const isSelected = newSelected.includes(choice);

    if (isSelected) {
      newSelected = newSelected.filter((item) => item !== choice);
    } else {
      newSelected.push(choice);
    }

    setSelectedOption(newSelected);
    updateCurrentSelection({
      key: id,
      data: newSelected,
      override: false,
      nextBlocked: false,
    });
  };

  const handleCustomInputCheckBoxOther = () => {
    let newSelected = [...selectedOption];

    if (otherSelected) {
      newSelected = newSelected.filter((item) => item !== otherValue);
    } else {
      newSelected.push(otherValue);
    }

    // newSelected = newSelected.filter((item) => item !== 'Other');
    setOtherSelected(!otherSelected);
    setSelectedOption(newSelected);
    updateCurrentSelection({
      key: id,
      data: newSelected,
      override: false,
      nextBlocked: false,
    });
  };

  const handleCustomInputChangeCheckBox = (event) => {
    const customValue = event.target.value;

    let newSelected = [...selectedOption, customValue];
    newSelected = newSelected.filter((item) => item !== otherValue);

    setOtherValue(customValue);
    setSelectedOption(newSelected);
    updateCurrentSelection({
      key: id,
      data: newSelected,
      override: false,
      nextBlocked: false,
    });
  };

  return (
    <div className="slide-container">
      <h2 className="slide-question">{question}</h2>
      <ul className="option-list">
        {options.map((option, index) => (
          <li key={`option-${index}`} className="option-item">
            <input
              type={checkbox ? "checkbox" : "radio"}
              id={`option-${index}`}
              value={option}
              checked={
                checkbox
                  ? selectedOption.includes(option)
                  : selectedOption === option
              }
              onChange={() =>
                checkbox
                  ? handleOptionSelectCheckBox(option)
                  : handleOptionSelectNormal([option, false])
              }
              className="option-input"
            />
            <label htmlFor={`option-${index}`} className="option-label">
              {option}
            </label>
          </li>
        ))}
        {add_other_option && (
          <li key="other-option" className="option-item">
            <input
              type={checkbox ? "checkbox" : "radio"}
              id="other-option"
              value={"Other"}
              checked={otherSelected}
              onChange={() =>
                checkbox
                  ? handleCustomInputCheckBoxOther()
                  : handleOptionSelectNormal(["Other", true])
              }
              className="option-input"
            />
            <label htmlFor="other-option" className="option-label">
              {"Other"}
            </label>
            {otherSelected && (
              <input
                className="other-input"
                type="text"
                value={checkbox ? otherValue : selectedOption}
                onChange={
                  checkbox
                    ? handleCustomInputChangeCheckBox
                    : handleCustomInputChangeNormal
                }
                placeholder="Other"
              />
            )}
          </li>
        )}
      </ul>
      {/* <p className="selected-option">Selected option: {selectedOption}</p> */}
    </div>
  );
  
};

export default MultipleChoiceSlide;
