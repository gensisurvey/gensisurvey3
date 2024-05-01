import React, { useRef, useEffect, useState, useContext } from "react";
import "./NodeInputSlide.css";
import { SelectionData } from "../SelectionData.js";
import * as d3 from "d3";


const NodeInputSlide = ({
  promptText,
  promptText2,
  specialInstructions,
  inlineText,
  updateCurrentSelection,
  id,
  include_svg = true
}) => {
  const [inputValue, setInputValue] = useState("");
  const [names, setNames] = useState([]);
  const { selectionData, setSelectionData } = useContext(SelectionData);

  const [flash, setFlash] = useState(false); // State to toggle flashing effect
  const [maxItemsReached, setMaxItemsReached] = useState(false); // State to toggle flashing effect

  const svgRef = useRef();
  const nodeBoxRef = useRef();

  useEffect(() => {
    if (selectionData && typeof selectionData === 'object' && selectionData.hasOwnProperty(id) && selectionData[id].reduce((total, current) => total + current, 0) !== -11) {
      // selectionData is defined, is an object, and has the specified key 'id'
      setNames(selectionData[id])
      updateCurrentSelection({
        key: id,
        data: selectionData[id], // Create an array of 11 elements filled with -1
        override: false,
        nextBlocked: true,
      });
      
    } else {
      // Either selectionData is undefined, not an object, or does not have the specified key 'id'
      updateCurrentSelection({
        key: id,
        data: Array(11).fill(-1), // Create an array of 11 elements filled with -1
        override: false,
        nextBlocked: true,
      });
    }
  }, []);


  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (names.length >= selectionData.max_nom) {
      setMaxItemsReached(true); // Activate flashing effect when selectionData.max_nom is reached

      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else if (inputValue.trim() === "" || names.includes(inputValue) ) {
      setFlash(true); // Activate flashing effect when input is empty
      setTimeout(() => setFlash(false), 1000); // Turn off flashing after 0.5s
    } else {
      setNames([...names, inputValue]);
      setInputValue("");

      
      updateCurrentSelection({key: id, data:[...names, inputValue], override:false, nextBlocked:false}); // Check if this line is correct


      
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
        color: selectionData.colors[i],
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
  
  return (
    <>
      <div className="node-input-text-wrapper">
        <h1 className="node-input-h1">{promptText}</h1>
        <h2 className="node-input-h2">{promptText2}</h2>
        <h3 className="node-input-h2">{specialInstructions}</h3>

      </div>
      <form className={flash ? "add-flash" : ""} onSubmit={handleSubmit}>
        <input
        className="node-input"
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
      {!include_svg &&
      <ul className="item-list">
        {names.map((item, index) => (
          <li key={index} id={index}>
            <b>{index + 1}. </b>{item}
          </li>
        ))}
      </ul>}
      {maxItemsReached && (
        <div className="max-items-reached">
          <p>Max Items Reached</p>
        </div>
      )}
    </>
  );
};

export default NodeInputSlide;
