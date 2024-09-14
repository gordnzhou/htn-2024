import os

from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
import motor.motor_asyncio
from dotenv import load_dotenv
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from search.search import SearchEngineService

import cohere

app = FastAPI()
search_engine_service = SearchEngineService()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("journal")
notes_collection = db.get_collection("notes")

cohere_client = cohere.Client(os.environ["COHERE_API_KEY"])

# TODO: AI's summary is too long, improve prompt
CONTEXT = ("This is a transcription of my speech in a stream of consciousness style. "
        "I want you to write the transcribed text into a casual but coherent piece of paragraph form writing while "
        "retaining my voice and tone so it still sounds like I wrote it. "
        "Only return the summarized text and nothing else. Don't prefix the response with anything.")

@app.get("/")
async def root():
    note = Note(text="hello", date_posted=datetime.now())

    return {"message": "Hello World"}

class NoteIn(BaseModel):
    text: str

class Note(BaseModel):
    text: str
    date_posted: datetime

class Query(BaseModel):
    text: str

@app.post("/summarize")
async def summarize(note: NoteIn):
    note_prompt = str(CONTEXT + " " + note.text)

    response = cohere_client.generate(
        model="command",
        prompt=note_prompt,
        max_tokens=500
    )
    
    return response.generations[0].text

@app.post("/create_note")
async def create_note(note: NoteIn):
    note = Note(
        text=note.text,
        date_posted=datetime.now()
    )

    new_note = await notes_collection.insert_one(note.dict())

    db_note = await notes_collection.find_one({"_id": new_note.inserted_id})
    db_note['date_posted'] = db_note['date_posted'].strftime("%Y-%m-%d %H:%M:%S")

    # Add note to search engine db
    journal_entry = "Date posted: " + db_note['date_posted'] + "Content: " + note.text
    search_engine_service.insert_entry(journal_entry)

    return str(db_note)

@app.post("/query_journal")
async def query(query: Query):
    response = search_engine_service.rag_search(query.text)
    return response