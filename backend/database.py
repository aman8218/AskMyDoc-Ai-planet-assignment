from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration
DATABASE_URL = "postgresql+psycopg2://default:aJqxpS47evzi@ep-plain-glitter-a4og6cvs.us-east-1.aws.neon.tech/verceldb?sslmode=require"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()  # Create a session instance
    try:
        yield db
    finally:
        db.close()  # Close the session after use

# Create a Base class for declarative base model definitions
Base = declarative_base()


