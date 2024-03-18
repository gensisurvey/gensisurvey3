// Banner.jsx
import React from 'react';
import './Banner.css'; // Import CSS file for styling

const Banner = ({ logo, text }) => {
  return (
    <div className="banner">
      <div className="logo-container">
        {logo && <img src={logo} alt="Logo" className="logo" />} {/* Optional logo SVG */}
      </div>
      <div className="title">{text}</div>
    </div>
  );
};

export default Banner;
