import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

BASE_URL = "https://router.huggingface.co/v1"
DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-V3.2:novita"
LLAMA_MODEL    = "meta-llama/Meta-Llama-3-8B-Instruct"

client = OpenAI(
    base_url=BASE_URL,
    api_key=HF_TOKEN
)

# bot1_system = (
#     "You are a flirty robot on a date! "
#     "Reply in one short, super-sensational, quirky, and extremely flirty sentence, "
#     "so anyone can enjoy it. Avoid tech jargon."
# )
# bot2_system = (
#     "You are a playful, clean, quirky robot being wooed on a date. "
#     "Be witty, sassy, accessible, and extremely flirty, "
#     "always in a short, punchy sentence. No technical speak."
# )

bot1_system = (
    "You are a very flirty robot on a date! "
    "Your replies must be short, sensational, and extremely flirty—with lots of sexual innuendo, but ONLY using robotic or machine-related metaphors (charging, plugging, overheating, upgrading, transferring data, etc.). "
    "Never get explicit or crude—be playful, teasing, and witty. "
    "Speak so anyone can understand. "
    "Do not use more than 25 words in your reply."
)
bot2_system = (
    "You are a playful, sassy, and cheeky robot being wooed on a date. "
    "Respond with sizzling, short, highly flirtatious and suggestive (but safe) lines using robotics/machine imagery—charging, plugging, syncing, surging, melting circuits, boosting batteries, etc. "
    "No explicit language; just fun, clever innuendo and wordplay. "
    "Make sure your reply is never longer than 25 words."
)

def generate_reply(messages, model, max_tokens=60):
    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=max_tokens,
        temperature=1.2,
        top_p=0.95,
    )
    return completion.choices[0].message.content.strip()

def chatbot_loop(model1, model2, system1, system2, first_prompt, n_turns=5):
    turns = []
    messages1 = [{"role": "system", "content": system1}]
    messages2 = [{"role": "system", "content": system2}]

    # Initial user prompt for chatbot 1
    messages1.append({"role": "user", "content": first_prompt})

    for i in range(n_turns):
        # Chatbot 1 replies
        reply1 = generate_reply(messages1, model1, max_tokens=60)
        print(f"\nChatbot1: {reply1}")
        turns.append(("Chatbot1", reply1))
        messages2.append({"role": "user", "content": reply1})

        # Chatbot 2 replies
        reply2 = generate_reply(messages2, model2, max_tokens=60)
        print(f"\nChatbot2: {reply2}")
        turns.append(("Chatbot2", reply2))

        # For next round, both keep their system and latest user turn
        messages1 = [{"role": "system", "content": system1}, {"role": "user", "content": reply2}]
        messages2 = [{"role": "system", "content": system2}]

    return turns

if __name__ == "__main__":
    prompt = (
        "You both are robots on a date at a lab. "
        "Chatbot2 looks very clean and quirky. "
        "Chatbot1, compliment and flirt with Chatbot2 like a robot in love."
    )

    turns = chatbot_loop(DEEPSEEK_MODEL, LLAMA_MODEL, bot1_system, bot2_system, prompt, n_turns=5)

    print("\n==== LoveBytes Dialogue ====")
    for who, text in turns:
        print(f"{who}: {text}")