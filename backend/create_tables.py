import sys
import os

# Add the project root to sys.path so 'backend' module can be found
# Assuming this script is in backend/create_tables.py, root is ../
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import SQLModel
from backend.database import engine
# Import models to register them
from backend.models import User, Message, Favorite

def create():
    print("Creating tables in database...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    create()
