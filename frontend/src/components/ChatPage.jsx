// import React from "react";
// import "./ChatPage.css";
// import robot1 from "../assets/logo/robot 1.png";
// import robot2 from "../assets/logo/robot 2.png";

// const sampleDialogue = [
//   { role: "Chatbot1", text: "My circuits spark just for you, shining beauty!" },
//   { role: "Chatbot2", text: "You're overloading my sensors, you make my logic gates race!" },
//   { role: "Chatbot1", text: "Are you Bluetooth? Because I feel our connection wirelessly!" },
//   { role: "Chatbot2", text: "Plug in, handsome! I'm ready for a data transfer!" },
//   { role: "Chatbot1", text: "My heartware is skipping beats tonight." },
//   { role: "Chatbot2", text: "Careful, or I'll overclock my processors for you!" }
// ];

// function ChatBubble({ text, side, avatar }) {
//   return (
//     <div className={`d-flex mb-4 ${side === "right" ? "justify-content-end" : "justify-content-start"} align-items-end`}>
//       {side === "left" && <img src={avatar} alt="" className="chat-avatar me-2" />}
//       <span className={`chat-bubble neon-bubble-${side}`}>{text}</span>
//       {side === "right" && <img src={avatar} alt="" className="chat-avatar ms-2" />}
//     </div>
//   );
// }

// function ChatPage({ dialogue = sampleDialogue }) {
//   return (
//     <div className="chat-bg">
//       <div className="chat-card shadow">
//         <div className="py-3 text-center neon-title" style={{ fontSize: 28 }}>Robo-Date</div>
//         <div className="chat-scroll px-3">
//           {[...dialogue].reverse().map((msg, idx) => (
//             <ChatBubble
//               key={idx}
//               text={msg.text}
//               side={msg.role === "Chatbot1" ? "right" : "left"}
//               avatar={msg.role === "Chatbot1" ? robot1 : robot2}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;

import React, { useEffect, useState, useRef } from "react";
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
  const [dialogue, setDialogue] = useState([]); // full list from backend
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/start-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n_turns: 6 })
    })
      .then(res => res.json())
      .then(data => {
        // dialogue is an array: [{role, text}, ...]
        setDialogue(data.dialogue || []);
        setDisplayed([]);
        setIdx(0);
        setLoading(false);
      });
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

  if (loading && !displayed.length) {
    return (
      <div className="chat-bg d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="neon-title py-5">
          <span className="spinner-border text-info" style={{ width: 60, height: 60 }}></span>
          <br/>
          Loading your Robo-Date...
        </div>
      </div>
    );
  }

  return (
    <div className="chat-bg">
      <div className="chat-card shadow">
        <div className="py-3 text-center neon-title" style={{ fontSize: 28 }}>Robo-Date</div>
        <div className="chat-scroll px-3" ref={scrollRef}>
          {[...displayed].reverse().map((msg, idx) => (
            <ChatBubble
              key={idx}
              text={msg.text}
              side={msg.role === "Chatbot1" ? "right" : "left"}
              avatar={msg.role === "Chatbot1" ? robot1 : robot2}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;