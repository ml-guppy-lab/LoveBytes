from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Import your chatbot logic!
from chatbot import chatbot_loop, bot1_system, bot2_system

app = FastAPI()

# Allow frontend (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class StartDateRequest(BaseModel):
    prompt: Optional[str] = ""
    n_turns: int = 6

class ChatTurn(BaseModel):
    role: str
    text: str

class ChatHistory(BaseModel):
    dialogue: List[ChatTurn]

@app.post("/start-date", response_model=ChatHistory)
def start_date(request: StartDateRequest = Body(...)):
    # You can pass the prompt if you want to seed it with user input
    # Here, just call your dialog function
    turns = chatbot_loop(bot1_system, bot2_system, n_turns=request.n_turns)
    dialogue = [ChatTurn(role=role, text=text) for (role, text) in turns]
    return ChatHistory(dialogue=dialogue)