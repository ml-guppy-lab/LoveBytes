import React from "react";

function CenteredCard({ children }) {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center neon-bg">
      <div
        className="card px-4 py-5 neon-card mx-3 mx-md-5"
        style={{ maxWidth: 420, width: "100%" }}
      >
        {children}
      </div>
    </div>
  );
}

export default CenteredCard;