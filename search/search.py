import chromadb
from chromadb.config import Settings
import cohere
import os

# ChromaDB & Cohere initialization
chroma_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chroma_db"  # Directory to persist the database
))
collection = chroma_client.create_collection(name="journal_entries")
cohere_client = cohere.Client(os.environ["COHERE_API_KEY"])

# Generate embeddings for journal entries
journal_entries = [
    "I went for a walk today and saw many dogs",
    "I am at Hack the North and it took 3 hours to think of an idea after we spent two weeks deciding what we would do.",
    "Today I fell and scratched my knee."
]
embeddings = cohere_client.embed(texts=journal_entries).embeddings

# Add embeddings to ChromaDB
ids = [f"doc_{i}" for i in range(len(journal_entries))]
collection.add(
    documents=journal_entries,
    embeddings=embeddings,
    ids=ids
)

# API Functions
def retrieve(query, top_k=5):
    query_embedding = cohere_client.embed(texts=[query]).embeddings[0]
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results['documents'][0]

response = retrieve("What happened at Hack the North?");
print(response);