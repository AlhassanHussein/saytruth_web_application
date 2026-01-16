from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from ..database import get_session
from ..models import User, Favorite
from ..auth_utils import get_current_user
from pydantic import BaseModel
import uuid

router = APIRouter()

class UserRead(BaseModel):
    id: uuid.UUID
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_prime: bool

class UserMeRead(UserRead):
    email: Optional[str] = None
    phone_number: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    # avatar_url: restricted to prime? MVP allow all for now or logic later

@router.get("/me", response_model=UserMeRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/search", response_model=List[UserRead])
def search_users(q: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username.contains(q))
    results = session.exec(statement).all()
    return results

@router.get("/{username}", response_model=UserRead)
def read_public_profile(username: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Favorites
@router.post("/favorites/{user_id}")
def add_favorite(user_id: uuid.UUID, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Check if exists
    statement = select(Favorite).where(Favorite.user_id == current_user.id, Favorite.favorite_user_id == user_id)
    if session.exec(statement).first():
        return {"message": "Already previously added"}
    
    fav = Favorite(user_id=current_user.id, favorite_user_id=user_id)
    session.add(fav)
    session.commit()
    return {"message": "Added to favorites"}

@router.get("/favorites/list", response_model=List[UserRead])
def list_favorites(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(User).join(Favorite, User.id == Favorite.favorite_user_id).where(Favorite.user_id == current_user.id)
    results = session.exec(statement).all()
    return results

@router.delete("/favorites/{user_id}")
def remove_favorite(
    user_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Remove a user from favorites.
    """
    statement = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.favorite_user_id == user_id
    )
    favorite = session.exec(statement).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
        
    session.delete(favorite)
    session.commit()
    return {"message": "User removed from favorites"}
