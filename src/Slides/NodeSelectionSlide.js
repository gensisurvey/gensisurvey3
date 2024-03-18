import React, { useRef, useEffect, useState } from "react";
import "./NodeSelectionSlide.css";
import * as d3 from "d3";

const DraggableBalls = ({ promptText, promptText2, nodeNames, updateCurrentSelection, nextBlocked }) => {
  const svgRef = useRef();
  const nodeBoxRef = useRef();
  const startLocationRef = useRef([]);

  const [initialState, setInitialState] = useState(null);

  const [ballsData, setBallsData] = useState([]);
  const [recentlyClickedBalls, setRecentlyClickedBalls] = useState([]);
  const [allLines, setAllLines] = useState([]); // [[0, 1], [2, 3], [4, 5]]

  // Call addBall when the component mounts
  useEffect(() => {
    addBall();
    setInitialState(true);
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
      .call(
        d3.drag().on("start", dragStart).on("drag", dragging).on("end", dragEnd)
      );

    // Append text inside circles
    svg
      .selectAll("text")
      .data(ballsData)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y + 28) // Adjust the y-position to place text just below the circle
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

    const handleClick = (e, d) => {
      const temp = recentlyClickedBalls;
      console.log("CLICK HANDLER");

      if (temp.length === 0) {
        temp.push(d.id); // adding to stack
      } else if (temp.length === 1 && d.id === temp[0]) {
        temp.shift(); // undoing a click
      } else if (temp.length === 1 && d.id !== temp[0]) {
        temp.push(d.id);
        setAllLines((allLines) => [...allLines, [temp[0], temp[1]].sort((a, b) => a - b)]);
        temp.shift();
        temp.shift();
      } else {
        console.log("exception");
      }

      setRecentlyClickedBalls(temp);
      // console.log(temp);
    };

    // called from the drag function, used to make lines between nodes
    function dragStart(event, d) {
      startLocationRef.current = [d.x, d.y];

      d3.select(this).raise().classed("active", true);
    }

    function dragging(event, d) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const minX = 20; // Minimum x-coordinate
      const minY = 20; // Minimum y-coordinate
      const maxX = svgRect.width; // - 20; // Maximum x-coordinate
      const maxY = svgRect.height; // - 20; // Maximum y-coordinate

      // Calculate the new position within the SVG boundaries
      const newX = Math.min(maxX - minX, Math.max(minX, event.x));
      const newY = Math.min(maxY - minY, Math.max(minY, event.y));

      // Update the position of the dragged node
      d3.select(this)
        .attr("cx", (d.x = newX))
        .attr("cy", (d.y = newY))
        .style("z-index", 5)


      // Update the text position with the node
      svg
        .selectAll("text")
        .filter((data) => data === d) // Filter to get the text corresponding to the dragged circle
        .attr("x", newX)
        .attr("y", newY + 28); // Adjust the y-position to place text just below the circle

      svg
        .selectAll("line")
        .attr("x1", (d) => ballsData[d[0]].x)
        .attr("y1", (d) => ballsData[d[0]].y)
        .attr("x2", (d) => ballsData[d[1]].x)
        .attr("y2", (d) => ballsData[d[1]].y)
        .style("z-index", -1000)
    }

    function dragEnd(event, d) {
      if (
        Math.sqrt(Math.pow(startLocationRef.current[0] - d.x, 2)) < 0.01 &&
        Math.sqrt(Math.pow(startLocationRef.current[1] - d.y, 2)) < 0.01
      ) {
        handleClick(event, d);
      }

      d3.select(this).classed("active", false);
    }
  }, [ballsData]);

  function removeDuplicatePairs(list) {
    const seen = new Map();
    let hasDuplicate = false;
  
    list.forEach((item, index) => {
      const sortedItem = item.slice().sort().join(',');
      if (seen.has(sortedItem)) {
        list.splice(index, 1); // Remove the duplicate item at the current index
        list.splice(seen.get(sortedItem), 1); // Remove the original duplicate item
        hasDuplicate = true;
      } else {
        seen.set(sortedItem, index); // Store the index of the first occurrence
      }
    });
  
    return { newList: list, hasDuplicate };
  }

  useEffect(() => {
    if (initialState !== null) {
      const svg = d3.select(svgRef.current);

      svg.selectAll("line").remove();

      console.log();
      //console.log("here", allLines);
      removeDuplicatePairs(allLines);

      updateCurrentSelection(allLines);


      svg
        .selectAll("line")
        .data(allLines)
        .enter()
        .append("line")
        .attr("x1", (d) => ballsData[d[0]].x)
        .attr("y1", (d) => ballsData[d[0]].y)
        .attr("x2", (d) => ballsData[d[1]].x)
        .attr("y2", (d) => ballsData[d[1]].y)
        .attr("stroke", "black")
        .attr("stroke-width", 4)
        .style("pointer-events", null)
        .style("z-index", -1000)
    }
  }, [allLines]);

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
        <h3 className="input-header-2">{"INSTRUCTIONS: These nodes are dragable, click on one and another to draw a line"}</h3>
      </div>
      <div ref={nodeBoxRef} className="node-box">
        <svg ref={svgRef} className="svg"></svg>
      </div>
    </div>
  );
};

export default DraggableBalls;
