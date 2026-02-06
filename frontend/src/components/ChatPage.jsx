import React from "react";
import "./ChatPage.css";
import robot1 from "../assets/logo/robot 1.png";
import robot2 from "../assets/logo/robot 2.png";

const sampleDialogue = [
  { role: "Chatbot1", text: "My circuits spark just for you, shining beauty!" },
  { role: "Chatbot2", text: "You're overloading my sensors, you make my logic gates race!" },
  { role: "Chatbot1", text: "Are you Bluetooth? Because I feel our connection wirelessly!" },
  { role: "Chatbot2", text: "Plug in, handsome! I'm ready for a data transfer!" },
  { role: "Chatbot1", text: "My heartware is skipping beats tonight." },
  { role: "Chatbot2", text: "Careful, or I'll overclock my processors for you!" }
];

function ChatBubble({ text, side, avatar }) {
  return (
    <div className={`d-flex mb-4 ${side === "right" ? "justify-content-end" : "justify-content-start"} align-items-end`}>
      {side === "left" && <img src={avatar} alt="" className="chat-avatar me-2" />}
      <span className={`chat-bubble neon-bubble-${side}`}>{text}</span>
      {side === "right" && <img src={avatar} alt="" className="chat-avatar ms-2" />}
    </div>
  );
}

function ChatPage({ dialogue = sampleDialogue }) {
  return (
    <div className="chat-bg">
      <div className="chat-card shadow">
        <div className="py-3 text-center neon-title" style={{ fontSize: 28 }}>Robo-Date</div>
        <div className="chat-scroll px-3">
          {[...dialogue].reverse().map((msg, idx) => (
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