from sqlmodel import SQLModel, create_engine
from backend.models import User, Message, Favorite
from backend.database import engine

def init_db():
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Tables created!")

if __name__ == "__main__":
    init_db()
