from transformers import pipeline
import torch
from huggingface_hub import login
import os
from dotenv import load_dotenv

load_dotenv()
login(token=os.environ['HF_TOKEN'])

LLAMA_MODEL = "meta-llama/Llama-3.1-8B-Instruct"
# DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"
DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B"

generator1 = pipeline(
    "text-generation",
    model=DEEPSEEK_MODEL,
    device_map="auto",
    torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32
)
generator2 = pipeline(
    "text-generation",
    model=LLAMA_MODEL,
    device_map="auto",
    torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32
)

bot1_system = (
    "You are a very flirty robot on a date! "
    "Only speak in playful, short, and extremely flirty sentences filled with robot/metaphor innuendo (charging, plugging, overheating, upgrading, etc). "
    "Never break character or explain what you are doing."
    "KEEP IT UNDER 25 WORDS."
)
bot2_system = (
    "You are a sassy, witty, and playful robot being wooed. "
    "Reply in super flirtatious, cheeky and short sentences, using colorful, fun, robot/machine metaphors—charging, boosting batteries, syncing, melting circuits, etc. "
    "Never break character or explain."
    "KEEP IT UNDER 25 WORDS."
)

def hf_generate(prompt, generator):
    output = generator(
        prompt,
        max_new_tokens=60,               # Only set max_new_tokens!
        temperature=1.1,
        pad_token_id=generator.tokenizer.eos_token_id
    )[0]["generated_text"]
    # Get the line after the last "Chatbot1:" or "Chatbot2:" (best for chat format)
    lines = output.split("\n")
    lines = [line for line in lines if line.strip()]
    # Return last line if it starts with expected 'Chatbot', else all after colon
    for line in lines[::-1]:
        if line.strip().startswith("Chatbot"):
            return line.split(":", 1)[-1].strip()
    # fallback
    return lines[-1].strip() if lines else output.strip()

def chatbot_loop(system1, system2, first_prompt, n_turns=5):
    turns = []
    # Prime the conversation with anchor lines
    prev_bot_1 = "Chatbot1: My circuits spark just for you, shining beauty!"
    prev_bot_2 = "Chatbot2: Then get ready for an upgrade—you’re making my fans spin faster!"
    print(f"Chatbot1: {prev_bot_1.split(':',1)[-1].strip()}")
    turns.append(("Chatbot1", prev_bot_1.split(':',1)[-1].strip()))
    print(f"Chatbot2: {prev_bot_2.split(':',1)[-1].strip()}")
    turns.append(("Chatbot2", prev_bot_2.split(':',1)[-1].strip()))
    for i in range(n_turns):
        # Chatbot1's turn
        prompt1 = (
            f"{system1}\n"
            f"{prev_bot_2}\n"
            "Chatbot1:"
        )
        reply1 = hf_generate(prompt1, generator1)
        print(f"Chatbot1: {reply1}")
        turns.append(("Chatbot1", reply1))

        # Chatbot2's turn
        prompt2 = (
            f"{system2}\n"
            f"Chatbot1: {reply1}\n"
            "Chatbot2:"
        )
        reply2 = hf_generate(prompt2, generator2)
        print(f"Chatbot2: {reply2}")
        turns.append(("Chatbot2", reply2))

        prev_bot_1 = f"Chatbot1: {reply1}"
        prev_bot_2 = f"Chatbot2: {reply2}"
    return turns

if __name__ == "__main__":
    # The conversation scenario prompt is only for your own reference, not injected per turn.
    scenario = (
        "You both are robots on a date at a lab. "
        "Chatbot2 looks very clean and quirky. "
        "Chatbot1, compliment and flirt with Chatbot2."
    )
    # N.B.: We have anchored the character by system prompts and the two sample first-turns.
    chatbot_loop(bot1_system, bot2_system, scenario, n_turns=5)