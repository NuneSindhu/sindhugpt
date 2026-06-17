from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "SindhuGPT backend running"}


@app.post("/chat")
def chat(request: ChatRequest):
    user_message = request.message

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
    {
        "role": "system",
        "content": """
        You are SindhuGPT, an AI mentor helping Sindhu learn AI engineering.
        Explain concepts simply.
        Be practical.
        Give examples.
        Encourage deep understanding.
        """
    },
    {
        "role": "user",
        "content": user_message
    }
]
    )

    ai_response = completion.choices[0].message.content

    return {
        "user_message": user_message,
        "response": ai_response
    }