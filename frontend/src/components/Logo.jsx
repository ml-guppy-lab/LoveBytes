import React from "react";
import logo from "../assets/logo/LoveBytes.png";

function Logo() {
  return (
    <img
      src={logo}
      alt="LoveBytes Logo"
      className="mb-4 neon-shadow"
      style={{
        width: 180,
        height: 180,
        objectFit: "contain",
        borderRadius: 32,
        background: "#181A2A",
      }}
    />
  );
}

export default Logo;