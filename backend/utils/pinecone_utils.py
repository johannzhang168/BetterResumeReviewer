import os
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import requests
from openai import OpenAI
import uuid

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX")

pc = Pinecone(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)
index = pc.Index(PINECONE_INDEX_NAME)


def push_to_pinecone(job_description: str, resume: str):
        combined_text = f"Job Description:\n{job_description}\nResume:\n{resume}"
        response = client.embeddings.create(
                model="text-embedding-3-small",
                input=combined_text
        )
        vector = response.data[0].embedding
        index.upsert([
        {
                "id": str(uuid.uuid4()),
                "values": vector,
                "metadata": {
                "job_title": "ML Intern",
                "job_description": job_description,
                "resume_that_got_the_job": resume,
                }
        }
        ])

def get_text_embedding(text: str) -> list[float]:
        response = client.embeddings.create(
                model="text-embedding-3-small",
                input=text
        )
        return response.data[0].embedding


def retrieve_relevant_chunks(query, chat_id, top_k: int = 5):
        query_embedding = get_text_embedding(query)
        results = index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
        )
        documents = []
        for match in results["matches"]:
                metadata = match.get("metadata", {})
                if metadata.get("doc_type") == "resume":
                        resumetext = metadata.get("resume_text")
                        documents.append(resumetext)
                if metadata.get("doc_type") == "job_description":       
                        job_description = metadata.get("job_description_text")
                        documents.append(job_description)
                if metadata.get("doc_type") == "job description and resume":
                        job_description = metadata.get("job_description")
                        resumetext = metadata.get("resume_text")
                        combined = f"--- Job Description ---\n{job_description}\n\n--- Resume ---\n{resumetext}"
                        documents.append(combined)
        return documents
