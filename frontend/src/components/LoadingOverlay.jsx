import React from "react";
import Loader from "./Loader";

function LoadingOverlay() {
  return (
    <div
      className="loading-overlay"
      style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(30, 20, 60, 0.70)",
        backdropFilter: "blur(4px)",
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 28
      }}
    >
      <Loader />
    </div>
  );
}

export default LoadingOverlay;