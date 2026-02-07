import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ChatPage.css";
import robot1 from "../assets/logo/robot 1.png";
import robot2 from "../assets/logo/robot 2.png";

function ChatBubble({ text, side, avatar }) {
  return (
    <div className={`d-flex mb-4 ${side === "right" ? "justify-content-end" : "justify-content-start"} align-items-end`}>
      {side === "left" && <img src={avatar} alt="" className="chat-avatar me-2" />}
      <span className={`chat-bubble neon-bubble-${side}`}>{text}</span>
      {side === "right" && <img src={avatar} alt="" className="chat-avatar ms-2" />}
    </div>
  );
}

function ChatPage() {
  const location = useLocation();
  const [dialogue, setDialogue] = useState(location.state?.dialogue || []); // get from navigation state
  const [displayed, setDisplayed] = useState([]);
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Data already loaded from home page, just reset display state
    setDisplayed([]);
    setIdx(0);
  }, []);

  useEffect(() => {
    if (!dialogue.length) return;
    if (idx < dialogue.length) {
      const timer = setTimeout(() => {
        setDisplayed(d => [...d, dialogue[idx]]);
        setIdx(i => i + 1);
      }, 900); // how fast to reveal
      return () => clearTimeout(timer);
    }
  }, [dialogue, idx]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [displayed]);

  return (
    <div className="chat-bg">
      <div className="chat-card shadow">
        <div className="py-3 text-center neon-title" style={{ fontSize: 28 }}>Robo-Date</div>
        <div className="chat-scroll px-3" ref={scrollRef}>
          {[...displayed].reverse().map((msg, idx) => (
            <ChatBubble
              key={idx}
              text={msg.text}
              side={msg.role === "Phi" ? "right" : "left"}
              avatar={msg.role === "Phi" ? robot2 : robot1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;