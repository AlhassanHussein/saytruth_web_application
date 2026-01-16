from sqlmodel import SQLModel, create_engine, Session
import os

# defaulting to sqlite for ease of initial run, user can switch to postgres
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
