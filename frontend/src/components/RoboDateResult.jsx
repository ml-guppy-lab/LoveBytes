import React from "react";
import { useLocation } from "react-router-dom";
import CenteredCard from "./CenteredCard";

function RoboDateResult() {
  const location = useLocation();
  const prompt = location.state?.prompt || "";

//   return (
//     <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center neon-bg">
//       <div className="card px-4 py-5 neon-card mx-3 mx-md-5" style={{ maxWidth: 420, width: "100%" }}>
//         <h2 className="neon-title mb-4">Robo Date Scenario</h2>
//         <div
//           className="fs-4 text-center"
//           style={{ color: "#20e3ff", minHeight: 60 }}
//         >
//           {prompt ? prompt : <span style={{ color: "#fe3a80" }}>Empty prompt</span>}
//         </div>
//       </div>
//     </div>
//   );
return (
    <CenteredCard>
      <h2 className="neon-title mb-4">Robo Date Scenario</h2>
      <div className="fs-4 text-center" style={{ color: "#20e3ff", minHeight: 60 }}>
        {prompt ? prompt : <span style={{ color: "#fe3a80" }}>Empty prompt</span>}
      </div>
    </CenteredCard>
  );
}

export default RoboDateResult;