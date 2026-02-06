import React from "react";

function LaunchButton({ onClick }) {
  return (
    <button
      className="btn btn-lg w-100 neon-btn py-3"
      style={{
        fontWeight: "bold",
        fontSize: "2rem",
        borderRadius: 16,
      }}
      onClick={onClick}
    >
      🚀 Launch Robo Date
    </button>
  );
}

export default LaunchButton;