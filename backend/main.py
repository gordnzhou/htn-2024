import os

from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from pymongo import MongoClient
import motor.motor_asyncio
from dotenv import load_dotenv

app = FastAPI()

load_dotenv()
# curl -X POST -H "Content-Type: application/json" -d '{"text":"Your note text here"}' http://127.0.0.1:8000/create_note

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("journal")
notes_collection = db.get_collection("notes")

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

    note = Note(
        text=note.text, 
        date_posted=datetime.now()
    )

    new_note = await notes_collection.insert_one(note.dict())

    # db_note = await notes_collection.find_one({"_id": result.inserted_id})

    return { "status_code": 200 }