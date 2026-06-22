from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base

from uuid import uuid4

from fastapi import Depends
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, Chat, Message

import os


load_dotenv() # reads api key

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# This client will talk to Groq servers.
client = Groq(
    api_key=os.getenv("GROQ_API_KEY") # Get value of environment variable named GROQ_API_KEY
)


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.get("/")
def home():
    return {"message": "SindhuGPT backend running"}


@app.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    session_id = request.session_id
    user_message = request.message

    chat = db.query(Chat).filter(
        Chat.id == session_id
    ).first()

    if not chat:
        chat = Chat(
            id=session_id,
            title=user_message[:20]
        )

        db.add(chat)
        db.commit()

    user_db_message = Message(
        id=str(uuid4()),
        chat_id=session_id,
        role="user",
        content=user_message
    )

    db.add(user_db_message)
    db.commit()

    previous_messages = db.query(Message).filter(
        Message.chat_id == session_id
    ).order_by(Message.created_at).all()

    messages = [
        {
            "role": "system",
            "content": """
            You are SindhuGPT, an AI mentor helping Sindhu learn AI engineering.
            Explain simply with examples.
            """
        }
    ]

    for msg in previous_messages:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages
    )

    ai_response = completion.choices[0].message.content

    ai_db_message = Message(
        id=str(uuid4()),
        chat_id=session_id,
        role="assistant",
        content=ai_response
    )

    db.add(ai_db_message)
    db.commit()

    return {
        "response": ai_response
    }

@app.get("/chats")
def get_chats(db: Session = Depends(get_db)):
    chats = (
        db.query(Chat)
        .order_by(Chat.created_at.desc())
        .all()
    )

    return [
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
        }
        for chat in chats
    ]


@app.get("/chats")
def get_chats(db: Session = Depends(get_db)):
    chats = (
        db.query(Chat)
        .order_by(Chat.created_at.desc())
        .all()
    )

    return [
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
        }
        for chat in chats
    ]


@app.get("/messages/{chat_id}")
def get_messages(
    chat_id: str,
    db: Session = Depends(get_db)
):
    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at)
        .all()
    )

    return [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in messages
    ]