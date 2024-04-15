import React, { useRef, useEffect, useState } from "react";
import "./NodeInputSlide.css";
import * as d3 from "d3";


const NodeInputSlide = ({
  promptText,
  promptText2,
  specialInstructions,
  maxNom,
  colors,
  inlineText,
  updateCurrentSelection,
  id,
  include_svg = true
}) => {
  const [inputValue, setInputValue] = useState("");
  const [names, setNames] = useState([]);
  // const [ballsData, setBallsData] = useState([]);

  const [flash, setFlash] = useState(false); // State to toggle flashing effect
  const [maxItemsReached, setMaxItemsReached] = useState(false); // State to toggle flashing effect

  const svgRef = useRef();
  const nodeBoxRef = useRef();

  // useEffect(() => {
  //   updateCurrentSelection({key: id, data:null}); // Check if this line is correct
  // }, []);


  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (names.length >= maxNom) {
      setMaxItemsReached(true); // Activate flashing effect when maxNom is reached

      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else if (inputValue.trim() === "" || names.includes(inputValue) ) {
      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else {
      setNames([...names, inputValue]);
      setInputValue("");

      
      updateCurrentSelection({key: id, data:[...names, inputValue]}); // Check if this line is correct


      
    }
  };

  useEffect(() => {
    // Your existing code for initial setup
    if (include_svg) {
    const nodeBoxRect = nodeBoxRef.current.getBoundingClientRect();
    const centerX = nodeBoxRect.width / 2 - 10;
    const centerY = nodeBoxRect.height / 2 - 10;
  
    const radius =
      nodeBoxRect.width > nodeBoxRect.height
        ? nodeBoxRect.height * 0.33
        : nodeBoxRect.width * 0.33;
  
    const newBallsData = [];
    for (let i = 0; i < names.length; i++) {
      const angle = (Math.PI * 2 * i) / names.length;
  
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
  
      newBallsData.push({
        x: parseInt(x),
        y: parseInt(y),
        color: colors[i],
        friendName: names[i],
        id: i,
        key: i,
      });
    }
  
    const svg = d3.select(svgRef.current);
  
    // Update existing circles with new positions and data
    const circles = svg.selectAll("circle").data(newBallsData);
    circles.exit().remove(); // Remove excess circles
    circles
      .enter()
      .append("circle")
      .merge(circles) // Merge new circles with existing ones
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 20)
      .attr("fill", (d) => d.color);
  
    // Update existing text elements with new positions and data
    const texts = svg.selectAll("text").data(newBallsData);
    texts.exit().remove(); // Remove excess text elements
    texts
      .enter()
      .append("text")
      .merge(texts) // Merge new text elements with existing ones
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 33)
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("-webkit-user-select", "none")
      .style("-moz-user-select", "none")
      .style("-ms-user-select", "none")
      .style("-webkit-tap-highlight-color", "transparent")
      .text((d) => d.friendName);
  
    // Clean up function to remove event listeners
    return () => {
      svg.selectAll("circle").on("click", null);
    };}
  }, [names]);
  

  function generateColor() {
    const hexCharacters = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ];
    let hexColorRep = "#"
    for (let index = 0; index < 6; index++) {
      const randomPosition = Math.floor(Math.random() * hexCharacters.length);
      hexColorRep += hexCharacters[randomPosition];
    }
    return hexColorRep;
  }

  return (
    <>
      <div className="node-input-text-wrapper">
        <h1 className="node-input-h1">{promptText}</h1>
        <h2 className="node-input-h2">{promptText2}</h2>
        <h3 className="node-input-h2">{specialInstructions}</h3>

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
      {include_svg &&
      <div ref={nodeBoxRef} className="node-box">
        <svg ref={svgRef} className="svg"></svg>
      </div>}
      <ul className="item-list">
        {names.map((item, index) => (
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
