from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import User, Message, MessageStatus
from ..auth_utils import get_current_user
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class MessageCreate(BaseModel):
    receiver_username: str
    content: str

class MessageRead(BaseModel):
    id: uuid.UUID
    content: str
    status: MessageStatus
    created_at: datetime
    # We never show sender, so no sender_id here

@router.post("/", status_code=status.HTTP_201_CREATED)
def send_message(msg: MessageCreate, session: Session = Depends(get_session)):
    # Find receiver
    statement = select(User).where(User.username == msg.receiver_username)
    receiver = session.exec(statement).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 1 Anonymous message limit logic check would be here (IP based or similar)

    db_msg = Message(
        receiver_id=receiver.id,
        content=msg.content,
        status=MessageStatus.INBOX
    )
    session.add(db_msg)
    session.commit()
    return {"message": "Message sent anonymously"}

@router.get("/", response_model=List[MessageRead])
def get_my_messages(status: MessageStatus = None, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Message).where(Message.receiver_id == current_user.id)
    if status:
        statement = statement.where(Message.status == status)
    statement = statement.order_by(Message.created_at.desc())
    results = session.exec(statement).all()
    return results

@router.put("/{message_id}/status")
def update_message_status(message_id: uuid.UUID, new_status: MessageStatus, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Message).where(Message.id == message_id, Message.receiver_id == current_user.id)
    msg = session.exec(statement).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    msg.status = new_status
    session.add(msg)
    session.commit()
    return {"message": "Status updated"}

@router.delete("/{message_id}")
def delete_message(message_id: uuid.UUID, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Message).where(Message.id == message_id, Message.receiver_id == current_user.id)
    msg = session.exec(statement).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    session.delete(msg)
    session.commit()
    return {"message": "Message deleted"}

# Public board of a user
@router.get("/public/{username}", response_model=List[MessageRead])
def get_public_messages(username: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    statement = select(Message).where(Message.receiver_id == user.id, Message.status == MessageStatus.PUBLIC).order_by(Message.created_at.desc())
    results = session.exec(statement).all()
    return results
