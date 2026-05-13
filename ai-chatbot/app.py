import gradio as gr
import ollama

def chat(message, history):
    messages = []
    for user_msg, assistant_msg in history:
        messages.append({"role": "user", "content": user_msg})
        messages.append({"role": "assistant", "content": assistant_msg})
    messages.append({"role": "user", "content": message})

    response = ollama.chat(
        model="deepseek-r1:8b",
        messages=messages,
    )
    return response["message"]["content"]

demo = gr.ChatInterface(
    fn=chat,
    title="AI Chatbot",
    description="Powered by Ollama (DeepSeek R1 8B)",
)

if __name__ == "__main__":
    demo.launch()
