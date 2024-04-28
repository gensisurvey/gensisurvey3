import React, { useRef, useEffect, useState } from "react";
import "./NodeConnect1Slide.css";
import * as d3 from "d3";

const NodeConnect1Slide = ({
  promptText,
  promptText2,
  nodeNames,
  updateCurrentSelection,
  maxNom,
  num_to_exclude,
  colors,
  id,
}) => {
  const svgRef = useRef();
  const nodeBoxRef = useRef();

  const [ballsData, setBallsData] = useState([]);

  // Call addBall when the component mounts
  useEffect(() => {
    if (nodeNames.reduce(
      (total, current) => total + current,
      0
    ) === -11 || (nodeNames.length <= num_to_exclude && num_to_exclude !== maxNom)) {
      updateCurrentSelection({ key: id, data: [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
      ] , override:true, nextBlocked:false});
    } else { 
      const outputData = Array(maxNom + 1).fill(0);
        for (let i = 0; i < nodeNames.length; i++) {
          outputData[i] = 0;
        }
        outputData[maxNom] = 0;
        for (let i = nodeNames.length; i < maxNom; i++) {
          outputData[i] = null;
        }
        outputData[num_to_exclude] = -1;
        // console.log(outputData);

        updateCurrentSelection({ key: id, data: outputData, override:false, nextBlocked:true }); // Check if this line is correct
      addBall();
    }
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
        const highlightedIds = highlightedCircles.data().map((d) => d.id);
        const outputData = Array(maxNom + 1).fill(0);
        for (let i = 0; i < nodeNames.length; i++) {
          outputData[i] = 0;
        }
        outputData[maxNom] = 0;

        highlightedIds.forEach((index) => {
          if (index >= 0 && index < outputData.length) {
            outputData[index] = 1;
          }
        });
        for (let i = nodeNames.length; i < maxNom; i++) {
          outputData[i] = null;
        }
        outputData[num_to_exclude] = -1;
        // console.log(outputData);

        updateCurrentSelection({ key: id, data: outputData, override:false, nextBlocked:false }); // Check if this line is correct
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
      .text((d) => d.friendName);

    // Clean up function to remove event listeners
    return () => {
      svg.selectAll("circle").on("click", null); // Remove click event listener from circles
    };
  }, [ballsData]);

  // Function to handle adding a new ball
  const addBall = () => {
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
        color: colors[i],
        friendName: nodeNames[i],
        id: i,
        key: i,
        edges: [],
      });
    }

    newBallsData.push({
      x: parseInt(centerX),
      y: parseInt(centerY),
      color: colors[maxNom],
      friendName: "you",
      id: maxNom,
      key: maxNom,
      edges: [],
    });
    // console.log(newBallsData, num_to_exclude, maxNom)

    if (num_to_exclude === maxNom) {
      newBallsData.splice(newBallsData.length - 1, 1)
    } else {
      newBallsData.splice(num_to_exclude, 1)
    }
    // console.log(newBallsData)
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
