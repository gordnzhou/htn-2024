import chromadb
import cohere
import os
from dotenv import load_dotenv
import hashlib

load_dotenv()

# ChromaDB & Cohere initialization
chroma_client = chromadb.PersistentClient(path="./chromadb")

# collection = chroma_client.create_collection(name="journal_entries")
collection = chroma_client.get_collection(name="journal_entries")
cohere_client = cohere.Client(os.environ["COHERE_API_KEY"])


# # Generate embeddings for journal entries
# journal_entries = [
#     "I went for a walk today and saw many dogs",
#     "I am at Hack the North and it took 3 hours to think of an idea after we spent two weeks deciding what we would do.",
#     "Today I fell and scratched my knee.",
#     "I was feeling very anxious today.",
#     "I was able to solve a bug with an LLM today, it was an issue with responses from the LLM. It was returning a Cohere object rather than a normal Python datatype."
# ]
# embeddings = cohere_client.embed(texts=journal_entries).embeddings

# # Add embeddings to ChromaDB
# ids = [f"doc_{i}" for i in range(len(journal_entries))]
# collection.add(
#     documents=journal_entries,
#     embeddings=embeddings,
#     ids=ids
# )

# API Functions
def retrieve_entries(query, top_k=5):
    query_embedding = cohere_client.embed(texts=[query]).embeddings[0]
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results['documents'][0]

def insert_entry(content):
    try:
        embeddings = cohere_client.embed(texts=[content]).embeddings
        hash_id = hashlib.sha256(content.encode('utf-8')).hexdigest()
        collection.add(
            documents=[content],
            embeddings=embeddings,
            ids=[hash_id]
        )
    except Exception as err:
        return err

    return True

def generate_response(query, retrieved_texts):
    prompt = (
        f"Based on the following journal entries:\n\n"
        f"{retrieved_texts}\n\n"
        f"Answer the following question:\n{query}"
    )
    response = cohere_client.generate(
        model='command-xlarge-nightly',
        prompt=prompt,
        max_tokens=150,
        temperature=0.7
    )
    return response.generations[0].text.strip()

def rag_search(query):
    retrieved_entries = retrieve_entries(query)
    retrieved_texts = "\n\n".join(retrieved_entries)
    response = generate_response(query, retrieved_texts)
    return response

response = rag_search("What did I do at Hack the North?")
print(response)