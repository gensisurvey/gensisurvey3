import React, { useRef, useEffect, useState } from "react";
import "./NodeConnect1Slide.css";
import * as d3 from "d3";

const NodeConnect1Slide = ({
  promptText,
  promptText2,
  nodeNames,
  updateCurrentSelection,
}) => {
  const svgRef = useRef();
  const nodeBoxRef = useRef();

  const [ballsData, setBallsData] = useState([]);

  // Call addBall when the component mounts
  useEffect(() => {
    addBall();
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Create circles for each ball
    svg
      .selectAll("circle")
      .data(ballsData)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 20)
      .attr("fill", (d) => d.color)
      .style("z-index", 5) // Set the z-index to place the circles behind text
      .on("click", function (e, d) {
        // Toggle highlight class on click
        d3.select(this).classed(
          "highlighted",
          !d3.select(this).classed("highlighted")
        );
        const highlightedCircles = svg.selectAll("circle.highlighted");
        const highlightedIds = highlightedCircles.data().map(d => d.id);
        console.log(highlightedIds)
        updateCurrentSelection(highlightedIds);
      });

    // Append text inside circles
    svg
      .selectAll("text")
      .data(ballsData)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 33) // Adjust the y-position to place text just below the circle
      .style("text-anchor", "middle") // Center text horizontally
      .style("dominant-baseline", "middle") // Center text vertically
      .style("pointer-events", "none") // Make text unclickable
      .style("user-select", "none") // Disable text selection
      .style("-webkit-user-select", "none") // For Safari
      .style("-moz-user-select", "none") // For Firefox
      .style("-ms-user-select", "none") // For IE/Edge
      .style("-webkit-tap-highlight-color", "transparent") // Disable tap highlight on mobile
      .style("z-index", 1) // Set the z-index to place the text in front of circles
      .text((d) => {
        // Convert friendName to first letter uppercase, rest lowercase
        return (
          d.friendName.charAt(0).toUpperCase() +
          d.friendName.slice(1).toLowerCase()
        );
      });

    // Clean up function to remove event listeners
    return () => {
      svg.selectAll("circle").on("click", null); // Remove click event listener from circles
    };


  }, [ballsData]);

  function generateColors(numColors) {
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
    const colors = [];

    for (let i = 0; i < numColors; i++) {
      let hexColorRep = "#";

      for (let index = 0; index < 6; index++) {
        const randomPosition = Math.floor(Math.random() * hexCharacters.length);
        hexColorRep += hexCharacters[randomPosition];
      }
      colors.push(hexColorRep);
    }
    console.log(colors);
    return colors;
  }

  // Function to handle adding a new ball
  const addBall = () => {
    const nodeColors = generateColors(nodeNames.length);
    const nodeBoxRect = nodeBoxRef.current.getBoundingClientRect();
    const centerX = nodeBoxRect.width / 2 - 10;
    const centerY = nodeBoxRect.height / 2 - 10;

    const radius =
      nodeBoxRect.width > nodeBoxRect.height
        ? nodeBoxRect.height * 0.33
        : nodeBoxRect.width * 0.33;

    const newBallsData = [];
    for (let i = 0; i < nodeNames.length; i++) {
      const angle = (Math.PI * 2 * i) / nodeNames.length; // Calculate the angle for each item

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      newBallsData.push({
        x: parseInt(x),
        y: parseInt(y),
        color: nodeColors[i],
        friendName: nodeNames[i],
        id: i,
        key: i,
        edges: [],
      });
    }

    setBallsData(newBallsData);
  };

  return (
    <div>
      <div className="text-wrapper">
        <h1 className="input-header">{promptText}</h1>
        <h2 className="input-header-2">{promptText2}</h2>
      </div>
      <div ref={nodeBoxRef} className="node-box">
        <svg ref={svgRef} className="svg"></svg>
      </div>
    </div>
  );
};

export default NodeConnect1Slide;
