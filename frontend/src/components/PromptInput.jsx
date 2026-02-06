import React from "react";

function PromptInput({ prompt, setPrompt }) {
  return (
    <input
      type="text"
      className="form-control mb-4 px-4 py-3 fs-5 text-center neon-input"
      placeholder="Describe your dream robot date…"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      style={{ borderWidth: 3, borderRadius: 16 }}
    />
  );
}

export default PromptInput;