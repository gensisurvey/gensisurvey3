import React, { useRef, useEffect, useState } from "react";
import "./NodeSelectionSlide.css";
import * as d3 from "d3";

const NodeSelectionSlide = ({
  promptText,
  promptText2,
  nodeNames,
  updateCurrentSelection,
}) => {
  const svgRef = useRef();
  const nodeBoxRef = useRef();
  const startLocationRef = useRef([]);

  const [initialState, setInitialState] = useState(null);

  const [ballsData, setBallsData] = useState([]);
  const [recentlyClickedBalls, setRecentlyClickedBalls] = useState([]);
  const [allLines, setAllLines] = useState([]); // [[0, 1], [2, 3], [4, 5]]

  function findPointCloserToPoint(initialPoint, targetPoint, distance) {
    // Calculate direction vector from initial point to target point
    let directionX = targetPoint.x - initialPoint.x;
    let directionY = targetPoint.y - initialPoint.y;

    // Calculate magnitude of direction vector
    let magnitude = Math.sqrt(directionX ** 2 + directionY ** 2);

    // Normalize direction vector
    let normalizedDirectionX = directionX / magnitude;
    let normalizedDirectionY = directionY / magnitude;

    // Scale normalized direction vector by distance
    let scaledDirectionX = normalizedDirectionX * distance;
    let scaledDirectionY = normalizedDirectionY * distance;

    // Calculate new point by adding scaled direction vector to initial point
    let newPointX = initialPoint.x + scaledDirectionX;
    let newPointY = initialPoint.y + scaledDirectionY;

    return { x: newPointX, y: newPointY };
  }

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

    const handleClick = (e, d, obj) => {
      const temp = recentlyClickedBalls;
      console.log("CLICK HANDLER");

      if (temp.length === 0) {
        temp.push(d.id); // adding to stack
        d3.select(obj)
          .style("stroke", "black") // set the line colour
          .style("opacity", 0.5) // set the element opacity
          .style("stroke-width", 5); // set the stroke width
      } else if (temp.length === 1 && d.id === temp[0]) {
        temp.shift(); // undoing a click

        d3.select(obj).attr("style", ""); //This will do the job
      } else if (temp.length === 1 && d.id !== temp[0]) {
        temp.push(d.id);
        setAllLines((allLines) => [
          ...allLines,
          [temp[0], temp[1]].sort((a, b) => a - b),
        ]);

        d3.selectAll("circle")
          .filter((d) => d.id === temp[0])
          .attr("style", "");

        d3.select(obj).attr("style", "");

        temp.shift();
        temp.shift();
      } else {
        console.log("exception");
      }
      console.log(temp);
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
        // .attr("style", "outline: thin solid red")   //This will do the job

        .style("z-index", 5);

      // Update the text position with the node
      svg
        .selectAll("text")
        .filter((data) => data === d) // Filter to get the text corresponding to the dragged circle
        .attr("x", newX)
        .attr("y", newY + 28); // Adjust the y-position to place text just below the circle

      svg
        .selectAll("line")
        .attr(
          "x1",
          (d) => findPointCloserToPoint(ballsData[d[0]], ballsData[d[1]], 20).x
        )
        .attr(
          "y1",
          (d) => findPointCloserToPoint(ballsData[d[0]], ballsData[d[1]], 20).y
        )
        .attr(
          "x2",
          (d) => findPointCloserToPoint(ballsData[d[1]], ballsData[d[0]], 20).x
        )
        .attr(
          "y2",
          (d) => findPointCloserToPoint(ballsData[d[1]], ballsData[d[0]], 20).y
        )
        .style("z-index", -1000);
    }

    function dragEnd(event, d) {
      if (
        Math.sqrt(Math.pow(startLocationRef.current[0] - d.x, 2)) < 3 &&
        Math.sqrt(Math.pow(startLocationRef.current[1] - d.y, 2)) < 3
      ) {
        handleClick(event, d, this);
        // d3.select(this)
        // .attr("style", "outline: thin solid red")   //This will do the job
      }

      d3.select(this).classed("active", false);
    }
  }, [ballsData]);

  function removeDuplicatePairs(list) {
    const seen = new Map();
    let hasDuplicate = false;

    list.forEach((item, index) => {
      const sortedItem = item.slice().sort().join(",");
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
        .attr(
          "x1",
          (d) => findPointCloserToPoint(ballsData[d[0]], ballsData[d[1]], 20).x
        )
        .attr(
          "y1",
          (d) => findPointCloserToPoint(ballsData[d[0]], ballsData[d[1]], 20).y
        )
        .attr(
          "x2",
          (d) => findPointCloserToPoint(ballsData[d[1]], ballsData[d[0]], 20).x
        )
        .attr(
          "y2",
          (d) => findPointCloserToPoint(ballsData[d[1]], ballsData[d[0]], 20).y
        )
        .attr("stroke", "black")
        .attr("stroke-width", 4)
        .style("pointer-events", null)
        .style("z-index", -1000);
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
    <div className="node-select-box">
      <div className="node-select-text-wrapper">
        <h1 className="node-select-h1">{promptText}</h1>
        <h2 className="node-select-h2">{promptText2}</h2>
        <h3 className="node-select-h3">
          {
            "INSTRUCTIONS: Click on the pairs that know each other, drag the nodes to make it easier to visualize"
          }
        </h3>
      </div>
      <div ref={nodeBoxRef} className="node-box">
        <svg ref={svgRef} className="svg"></svg>
      </div>
    </div>
  );
};

export default NodeSelectionSlide;
