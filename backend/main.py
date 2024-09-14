import os

from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from pymongo import MongoClient
import motor.motor_asyncio
from dotenv import load_dotenv

import cohere

app = FastAPI()

load_dotenv()
# curl -X POST -H "Content-Type: application/json" -d '{"text":"Your note text here"}' http://127.0.0.1:8000/create_note

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("journal")
notes_collection = db.get_collection("notes")

cohere_client = cohere.Client(os.environ["COHERE_API_KEY"])

CHAT_HISTORY = {
    "role": "USER",
    "message": (
        "This is a transcription of my speech for a course review. I spoke freely, "
        "in a stream of consciousness style. I want you to write the transcribed "
        "text into a coherent and concise paragraph while retaining my voice and "
        "tone so it still sounds like I wrote it. Only return the summarized text "
        "and nothing else."
    )
}

@app.get("/")
async def root():
    note = Note(text="hello", date_posted=datetime.now())
         
    new_note = await notes_collection.insert_one(note.dict())

    return {"message": "Hello World"}


class NoteIn(BaseModel):
    text: str

class Note(BaseModel):
    text: str
    date_posted: datetime


@app.post("/create_note")
async def create_note(note: NoteIn):

    response = cohere_client.chat(
        chat_history=[CHAT_HISTORY],
        message=note.text,
    )

    note = Note(
        text=note.text, 
        date_posted=datetime.now()
    )

    new_note = await notes_collection.insert_one(note.dict())

    db_note = await notes_collection.find_one({"_id": new_note.inserted_id})

    return db_note