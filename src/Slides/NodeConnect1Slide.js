import React, { useRef, useEffect, useState, useContext } from "react";
import "./NodeConnect1Slide.css";
import { SelectionData } from "../SelectionData.js";
import * as d3 from "d3";

const NodeConnect1Slide = ({
  promptText,
  promptText2,
  updateCurrentSelection,
  num_to_exclude,
  id,
}) => {
  const svgRef = useRef();
  const nodeBoxRef = useRef();

  const [ballsData, setBallsData] = useState([]);
  const { selectionData, setSelectionData } = useContext(SelectionData);


  // Call addBall when the component mounts
  useEffect(() => {
    if (selectionData && typeof selectionData === 'object' && selectionData.hasOwnProperty(id) && selectionData[id].reduce((total, current) => total + current, 0) !== -11) {
      addBall(selectionData[id])
    }
    else if (
      selectionData.all_people.reduce((total, current) => total + current, 0) === -11 ||
      (selectionData.all_people.length <= num_to_exclude && num_to_exclude !== selectionData.max_nom) 
    ) {
      updateCurrentSelection({
        key: id,
        data: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        override: true,
        nextBlocked: false,
      });
    } else {
      console.log(selectionData.all_people.length, selectionData.max_nom)
      const outputData = Array(selectionData.max_nom + 1).fill(0);
      for (let i = selectionData.all_people.length; i < selectionData.max_nom; i++) {
        outputData[i] = null;
      }
      outputData[num_to_exclude] = -1;

      updateCurrentSelection({
        key: id,
        data: outputData,
        override: false,
        nextBlocked: true,
      });
      addBall([]);
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg
      .selectAll("circle")
      .data(ballsData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 20)
      .attr("fill", (d) => (d.to_exclude ? "black" : d.color))
      .style("z-index", 5) // Set the z-index to place the circles behind text
      .classed("highlighted", (d) => d.highlighted)
      .on("click", function (e, d) {
        if (!d.to_exclude) {
          d3.select(this).classed(
            "highlighted",
            !d3.select(this).classed("highlighted")
          );
          const highlightedCircles = svg.selectAll("circle.highlighted");
          const highlightedIds = highlightedCircles.data().map((d) => d.id);
          const outputData = Array(selectionData.max_nom + 1).fill(0);

          highlightedIds.forEach((index) => {
            if (index >= 0 && index < outputData.length) {
              outputData[index] = 1;
            }
          });
          for (let i = selectionData.all_people.length; i < selectionData.max_nom; i++) {
            outputData[i] = null;
          }
          outputData[num_to_exclude] = -1;

          updateCurrentSelection({
            key: id,
            data: outputData,
            override: false,
            nextBlocked: false,
          }); // Check if this line is correct
        }
      });

    // Append text inside circles
    svg
      .selectAll("text")
      .data(ballsData)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 33) // Adjust the y-position to place text just below the circle
      .style("font-weight", (d) => d.to_exclude ? 700 : 300)
      .style("text-anchor", "middle") // Center text horizontally
      .style("dominant-baseline", "middle") // Center text vertically
      .style("pointer-events", "none") // Make text unclickable
      .style("user-select", "none") // Disable text selection
      .style("-webkit-user-select", "none") // For Safari
      .style("-moz-user-select", "none") // For Firefox
      .style("-ms-user-select", "none") // For IE/Edge
      .style("-webkit-tap-highlight-color", "transparent") // Disable tap highlight on mobile
      .style("z-index", 1) // Set the z-index to place the text in front of circles
      .text((d) => d.friendName);

    // Clean up function to remove event listeners
    return () => {
      svg.selectAll("circle").on("click", null); // Remove click event listener from circles
    };
  }, [ballsData]);

  // Function to handle adding a new ball
  const addBall = (highlights) => {
    // console.log("in add ball")

    const nodeBoxRect = nodeBoxRef.current.getBoundingClientRect();
    const centerX = nodeBoxRect.width / 2 - 10;
    const centerY = nodeBoxRect.height / 2 - 10;

    const radius =
      nodeBoxRect.width > nodeBoxRect.height
        ? nodeBoxRect.height * 0.33
        : nodeBoxRect.width * 0.33;

    const randomOrder = [];
    for (let num of selectionData.clockwise_name_order) {
      if (num === selectionData.max_nom || num < selectionData.all_people.length) {
        randomOrder.push(num);
      }
    }
    // console.log(randomOrder, selectionData.clockwise_name_order, selectionData.max_nom, selectionData.all_people, selectionData.colors);
    const newBallsData = [];

    for (let i = 0; i < randomOrder.length; i++) {
      const angle = (Math.PI * 2 * i) / (selectionData.all_people.length + 1);

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      if (randomOrder[i] === selectionData.max_nom) {
        newBallsData.push({
          x: parseInt(x),
          y: parseInt(y),
          color: selectionData.colors[i],
          friendName: "you",
          id: randomOrder[i],
          key: randomOrder[i],
          edges: [],
          to_exclude: randomOrder[i] === num_to_exclude,
          highlighted: highlights[randomOrder[i]] === 1
        });
      } else {
        newBallsData.push({
          x: parseInt(x),
          y: parseInt(y),
          color: selectionData.colors[i],
          friendName: selectionData.all_people[randomOrder[i]],
          id: randomOrder[i],
          key: randomOrder[i],
          edges: [],
          to_exclude: randomOrder[i] === num_to_exclude,
          highlighted: highlights[randomOrder[i]] === 1,
        });
      }
    }

    // console.log(newBallsData);
    setBallsData(newBallsData);
  };

  return (
    <>
      <div className="node-connect-text-wrapper">
        <h1 className="node-connect-h1">{promptText}</h1>
        <h2 className="node-connect-h2">{promptText2}</h2>
      </div>
      <div ref={nodeBoxRef} className="node-box">
        <svg ref={svgRef} className="svg"></svg>
      </div>
    </>
  );
};

export default NodeConnect1Slide;
