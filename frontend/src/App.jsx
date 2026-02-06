import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./neon.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import CenteredCard from "./components/CenteredCard";
import LoadingOverlay from "./components/LoadingOverlay";
import ChatPage from "./components/ChatPage";

import Logo from "./components/Logo";
import PromptInput from "./components/PromptInput";
import LaunchButton from "./components/LaunchButton";
import Loader from "./components/Loader";
import RoboDateResult from "./components/RoboDateResult";

function MainForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleLaunch = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     navigate("/result", { state: { prompt: prompt.trim() } });
  //   }, 2000);
  // };
  const handleLaunch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/chat");
    }, 1500);
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center neon-bg" style={{ position: "relative" }}>
      <div
        className="card px-4 py-5 neon-card mx-3 mx-md-5 position-relative"
        style={{ maxWidth: 420, width: "100%", minHeight: 350 }}
      >
        <div className="d-flex flex-column align-items-center">
          <Logo />
          <h1 className="mb-4 mt-2 neon-title">LoveBytes</h1>
          <PromptInput prompt={prompt} setPrompt={setPrompt} />
          <LaunchButton onClick={handleLaunch} />
        </div>
        {loading && <LoadingOverlay />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainForm />} />
        <Route path="/result" element={<RoboDateResult />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;