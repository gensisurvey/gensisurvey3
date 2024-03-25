import React, { useRef, useEffect, useState } from "react";
import "./TheSlide.css";

const TheSlide = (props) => {
  return (
    <div className="the-slide-center">
      <div className="the-slide-box">
        {props.children}
      </div>
    </div>
  );
};

export default TheSlide;
