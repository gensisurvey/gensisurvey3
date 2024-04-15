import React, { useRef, useEffect, useState } from "react";
import "./LadderSlide.css";
import * as d3 from "d3";

import LadderImg from "../Images/ladder.svg";

const LadderDrag = ({ person, id, ladderMiniSubmit }) => {
  const svgRef = useRef();
  const nodeBoxRef = useRef();

  const [ladderRung, setLadderRung] = useState("");
  const [flash, setFlash] = useState(false);
  const [ballData, setBallData] = useState([]);

  const handleChange = (e) => {
    const current_char = e.target.value.charAt(e.target.value.length - 1);

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      setLadderRung("");
    } else if (/^[1-9]$/.test(current_char)) {
      setLadderRung(current_char);
    } else {
      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ladderRung === "") {
      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    } else {
      ladderMiniSubmit(ladderRung, id);
    }
  };

  // Load the SVG image using D3
  // useEffect(() => {
  //   const svg = d3.select(svgRef.current);

  //   // Load the SVG image
  //   // d3.select("body")
  //   //   .append("svg")
  //   //   .data(LadderImg)
  //   //   .attr("width", 20)
  //   //   .attr("height", 20);

  //   // xml(LadderImg).then((data) => {
  //   //   const importedNode = document.importNode(data.documentElement, true);
  //   //   const svgNode = svg.node();
  //   //   svgNode.innerHTML = ''; // Clear existing content
  //   //   svgNode.appendChild(importedNode);
  //   // });
  // }, []);

  useEffect(() => {
    const nodeBoxRect = nodeBoxRef.current.getBoundingClientRect();
    const centerX = nodeBoxRect.width / 2 - 50;
    const centerY = nodeBoxRect.height / 2;
    setBallData([{ x: centerX, y: centerY, r: 20, c: "red", person: person }]);
  }, [person]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // Update existing balls

    // svg.select("body")
    // .attr("width", 300)
    // .attr("height", 300);
    svg
      .selectAll("circle")
      .data(ballData)
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.c)
      .style("z-index", 7) // Set the z-index to place the text in front of circles
      .call(
        d3.drag().on("start", dragStart).on("drag", dragging).on("end", dragEnd)
      );

    // Update existing texts
    svg
      .selectAll("text")
      .data(ballData)
      .join("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("fill", 'white')
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .style("z-index", 10)
      .style("font-weight", 500)
      .style("text-anchor", "middle") // Center text horizontally
      .style("dominant-baseline", "middle") // Center text vertically
      .style("pointer-events", "none") // Make text unclickable
      .style("user-select", "none") // Disable text selection
      .style("-webkit-user-select", "none") // For Safari
      .style("-moz-user-select", "none") // For Firefox
      .style("-ms-user-select", "none") // For IE/Edge
      .style("-webkit-tap-highlight-color", "transparent") // Disable tap highlight on mobile
      .style("z-index", 10) // Set the z-index to place the text in front of circles
      .text(
        (d) =>
          d.person.charAt(0).toUpperCase() + d.person.slice(1).toLowerCase()
      );

    function dragStart(event, d) {
      d3.select(this).raise().classed("active", true);
    }

    function dragging(event, d) {
      const newX = Math.min(
        svgRef.current.clientWidth - d.r,
        Math.max(d.r, event.x)
      );
      const newY = Math.min(
        svgRef.current.clientHeight - d.r,
        Math.max(d.r, event.y)
      );

      d3.select(this)
        .attr("cx", (d.x = newX))
        .attr("cy", (d.y = newY))
        .style("z-index", 6) // Set the z-index to place the text in front of circles


      svg
        .selectAll("text")
        .filter((data) => data === d)
        .attr("x", newX)
        .attr("y", newY)
        .style("z-index", 10) // Set the z-index to place the text in front of circles

    }

    function dragEnd(event, d) {
      d3.select(this).classed("active", false);
    }
  }, [ballData]);

  return (
    <div className="ladder-mini-box">
        <div ref={nodeBoxRef} className="ladder-svg-box">
          {LadderImg && (
            <img src={LadderImg} alt="Logo" className="ladder-img" />
          )}
          <svg ref={svgRef} className="ladder-svg"></svg>
        </div>
        
      {/* <div>
        At the top of the ladder are the people who are best off. At the bottom
        of the ladder are the people who are worst off. Which rung of the ladder
        best represents where you think <b>{person}</b> stands on the ladder?
      </div>
      <div>Please type a rung between 1-9</div> */}

      {/* <form onSubmit={handleSubmit}>
        <input
          className={flash ? "add-flash ladder-input" : "ladder-input"}
          type="text"
          value={ladderRung}
          onChange={handleChange}
          placeholder={"1-9"}
        />
        <button className="ladder-button" type="submit">
          Add
        </button>
      </form> */}
    </div>
  );
};

export default LadderDrag;

// const LadderDrag = ({person, id }) => {
//   const svgRef = useRef();
//   const nodeBoxRef = useRef();

//   const [ballData, setBallData] = useState([])

//   useEffect(() => {
//     const nodeBoxRect = nodeBoxRef.current.getBoundingClientRect();
//     const centerX = nodeBoxRect.width / 2 - 10;
//     const centerY = nodeBoxRect.height / 2 - 10;
//     setBallData({x: centerX, y: centerY, r: 20, c: 'black'})

//       }, []);

//   const drag = d3.drag().on("drag", function (event) {
//     const newX = event.x;
//     const newY = event.y;

//     d3.select(this).attr("cx", newX).attr("cy", newY);
//   });

//   return (
//     <div ref={nodeBoxRef} className="node-box">
//       <svg ref={svgRef} width="800" height="400">
//         {/* Background rectangle */}
//         <rect width="100%" height="100%" fill="#f9f9f9" />

//         {/* Draggable ball */}
//         <circle
//           cx={ballData.x}
//           cy={ballData.y}
//           r={ballData.r}
//           fill={ballData.c}
//           cursor="move"
//           className="ball"
//         />

//         {/* Text below the ball */}
//         <text
//           x={ballData.x}
//           y={ballData.y + ballData.r + 20}
//           textAnchor="middle"
//           fontSize="14px"
//           fill="#333"
//         >
//           {person}
//         </text>

//         {/* Apply drag behavior to the ball */}
//         <g
//           className="ball-container"
//           ref={(node) => d3.select(node).call(drag)}
//         />
//       </svg>
//     </div>
//   );
// };

// export default LadderDrag;
