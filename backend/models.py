from typing import Optional
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
import uuid

class MessageStatus(str, Enum):
    INBOX = "inbox"
    PUBLIC = "public"
    FAVORITE = "favorite"

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_prime: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    messages: list["Message"] = Relationship(back_populates="receiver")

class Message(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    receiver_id: uuid.UUID = Field(foreign_key="user.id")
    content: str
    status: MessageStatus = Field(default=MessageStatus.INBOX)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    receiver: User = Relationship(back_populates="messages")

class Favorite(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    favorite_user_id: uuid.UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
