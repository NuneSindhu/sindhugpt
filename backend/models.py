from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Chat(Base):
    __tablename__ = "chats"

    id = Column(String, primary_key=True)
    title = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    messages = relationship(
        "Message",
        back_populates="chat",
        cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)

    chat_id = Column(
        String,
        ForeignKey("chats.id")
    )

    role = Column(String)

    content = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    chat = relationship(
        "Chat",
        back_populates="messages"
    )