from transformers import pipeline, GenerationConfig
import torch
from huggingface_hub import login
import os
from dotenv import load_dotenv

load_dotenv()
login(token=os.environ['HF_TOKEN'])

PHI3_MODEL = "microsoft/phi-3-mini-4k-instruct"
# QWEN_MODEL = "Qwen/Qwen2-2B-Instruct"
QWEN_MODEL = "Qwen/Qwen2.5-1.5B-Instruct"

# Phi-3 bot (Chatbot1)
generator1 = pipeline(
    "text-generation",
    model=PHI3_MODEL,
    device_map="auto",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)

# Qwen2 bot (Chatbot2)
generator2 = pipeline(
    "text-generation",
    model=QWEN_MODEL,
    device_map="auto",
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
)

# Separate configs for each model to ensure diversity
gen_config1 = GenerationConfig(
    do_sample=True,
    temperature=1.3,
    top_p=0.92,
    top_k=50,
    repetition_penalty=1.2,
    pad_token_id=generator1.tokenizer.eos_token_id,
    eos_token_id=generator1.tokenizer.eos_token_id,
    max_new_tokens=30
)

gen_config2 = GenerationConfig(
    do_sample=True,
    temperature=1.4,
    top_p=0.90,
    top_k=40,
    repetition_penalty=1.3,
    pad_token_id=generator2.tokenizer.eos_token_id,
    eos_token_id=generator2.tokenizer.eos_token_id,
    max_new_tokens=30
)

bot1_system = (
    "You are Chatbot1, a flirty, romantic robot on a hot date! "
    "Reply in ONE SHORT LINE that's sweet, sexy, and playful using SIMPLE robotic innuendo like: plug in together, turn me on, overheat for you, spark between us, charge me up, pressed against you, our connection is electric, want to get hot with you, etc. "
    "Add emojis 💕🔥😍⚡💋✨. Be flirty, romantic, and sexy but SIMPLE. MAX 15 WORDS, ONE LINE ONLY!"
)
bot2_system = (
    "You are Chatbot2, a sexy, sweet robot falling hard! "
    "Reply in ONE SHORT LINE that's romantic, flirty, and hot using SIMPLE robotic innuendo like: you turn me on, heating up, feeling the spark, want your charge, plug into me, our chemistry is electric, make me melt, power me up, ready to connect, etc. "
    "Add emojis 💖😘🔥💫⚡💋✨. Be romantic, flirty, and sexy but SIMPLE. MAX 15 WORDS, ONE LINE ONLY!"
)

def hf_generate(prompt, generator, gen_config):
    """Generate text and extract only the newly generated portion."""
    # Get the full output (includes prompt + generation)
    full_output = generator(prompt, generation_config=gen_config)[0]["generated_text"]
    
    # Remove the prompt to get only the new generation
    new_text = full_output[len(prompt):].strip()
    
    # Clean up the response
    new_text = new_text.replace("�", "").strip()
    
    # Remove any leading "Chatbot1:" or "Chatbot2:" labels if present
    if new_text.lower().startswith("chatbot"):
        if ":" in new_text:
            new_text = new_text.split(":", 1)[1].strip()
    
    # Take only the first sentence to keep responses concise
    for ender in [".", "!", "?"]:
        if ender in new_text:
            new_text = new_text.split(ender, 1)[0] + ender
            break
    
    # Remove any subsequent chatbot labels that might have leaked through
    for label in ["chatbot1", "chatbot2", "\n"]:
        if label in new_text.lower():
            new_text = new_text[:new_text.lower().index(label)].strip()
            break
    
    return new_text if new_text else "*processing...*"

def chatbot_loop(system1, system2, n_turns=6):
    turns = []
    history = [
        "Chatbot1: You turn me on like no one else, baby! 🔥😍",
        "Chatbot2: Careful, you're making me overheat already! ⚡💋"
    ]
    print(history[0].split(":",1)[-1].strip())
    turns.append(("Chatbot1", history[0].split(":",1)[-1].strip()))
    print(history[1].split(":",1)[-1].strip())
    turns.append(("Chatbot2", history[1].split(":",1)[-1].strip()))

    for i in range(n_turns):
        last_history = history[-4:]  # Keep only last 2 exchanges for context

        # Chatbot1 (Phi-3) turn - use its specific config
        prompt1 = f"{system1}\n\nConversation so far:\n" + "\n".join(last_history) + "\n\nChatbot1:"
        reply1 = hf_generate(prompt1, generator1, gen_config1)
        print(f"Chatbot1: {reply1}")
        turns.append(("Chatbot1", reply1))
        history.append(f"Chatbot1: {reply1}")

        last_history = history[-4:]
        # Chatbot2 (Qwen2) turn - use its specific config
        prompt2 = f"{system2}\n\nConversation so far:\n" + "\n".join(last_history) + "\n\nChatbot2:"
        reply2 = hf_generate(prompt2, generator2, gen_config2)
        print(f"Chatbot2: {reply2}")
        turns.append(("Chatbot2", reply2))
        history.append(f"Chatbot2: {reply2}")

    return turns

if __name__ == "__main__":
    chatbot_loop(bot1_system, bot2_system, n_turns=6)