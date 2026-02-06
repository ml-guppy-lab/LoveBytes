import React from "react";

function Loader() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-info mb-3" style={{ width: 60, height: 60 }}></div>
      <div className="text-info neon-title fs-4">Loading your robo-date...</div>
    </div>
  );
}

export default Loader;