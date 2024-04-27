import React, { useState } from "react";
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



  const handleOptionSelectNormal = ([choice, other_bool]) => {
    if (other_bool) {
      setOtherSelected(true);
    } else {
      setOtherSelected(false);
    }

    setSelectedOption(choice);
      updateCurrentSelection({ key: id, data: choice });
  };

  
  const handleCustomInputChangeNormal = (event) => {
    const customValue = event.target.value;
    setSelectedOption(customValue);
    updateCurrentSelection({ key: id, data: customValue });
  };

  const handleOptionSelectCheckBox = (choice) => {

    let newSelected = [...selectedOption]
    const isSelected = newSelected.includes(choice);

    if (isSelected) {
      newSelected = newSelected.filter((item) => item !== choice);
    } else {
      newSelected.push(choice)
    }
    
    setSelectedOption(newSelected)

    if (otherSelected) {
      newSelected = newSelected.filter((item) => item !== 'Other');
      newSelected.push(otherValue)
      updateCurrentSelection({ key: id, data: newSelected })

    }
    else {
      updateCurrentSelection({ key: id, data: newSelected })

    }
  };

  const handleCustomInputCheckBoxOther = () => {
    const op = !otherSelected
    let newSelected = [...selectedOption]


    if (!op) {
      newSelected = newSelected.filter((item) => item !== otherValue);
      // setOtherValue('Other')
    } else {
      newSelected.push(otherValue)

    }

    setSelectedOption(newSelected)
    updateCurrentSelection({ key: id, data: newSelected })
    setOtherSelected(!otherSelected)
  }

  
  const handleCustomInputChangeCheckBox = (event) => {
    const customValue = event.target.value;
    setOtherValue(customValue);

    let newSelected = [...selectedOption, customValue]
    newSelected = newSelected.filter((item) => item !== 'Other');


    updateCurrentSelection({ key: id, data: newSelected });
  };
  


  return (
    <div className="slide-container">
      <h2 className="slide-question">{question}</h2>
      <ul className="option-list">
        {options.map((option, index) => (
          <li key={index} className="option-item">
            <input
              type={checkbox ? "checkbox" : "radio"}
              id={`option-${index}`}
              value={option}
              checked={checkbox? selectedOption.includes(option) : selectedOption === option}
              onChange={() => checkbox ? handleOptionSelectCheckBox(option) : handleOptionSelectNormal([option, false])}
              className="option-input"
            />
            <label htmlFor={`option-${index}`} className="option-label">
              {option}
            </label>
          </li>
        ))}
        {add_other_option && (
          <li key={options.length + 1} className="option-item">
            <input
              type={checkbox ? "checkbox" : "radio"}
              id={`option-other`}
              value={'Other'}
              checked={otherSelected}
              onChange={() => checkbox ? handleCustomInputCheckBoxOther() : handleOptionSelectNormal(['Other', true])}
              className="option-input"
            />
            <label htmlFor={`option-other`} className="option-label">
              {'Other'}
            </label>
            {otherSelected && (
              <input
                className="other-input"
                type="text"
                value={checkbox ? otherValue : selectedOption}
                onChange={checkbox ? handleCustomInputChangeCheckBox : handleCustomInputChangeNormal}
                placeholder="Other"
              />
            )}
          </li>
        )}
      </ul>
      <p className="selected-option">Selected option: {selectedOption}</p>
    </div>
  );
};

export default MultipleChoiceSlide;
