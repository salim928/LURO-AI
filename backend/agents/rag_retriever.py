# backend/agents/rag_retriever.py
import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from typing import List, Dict
import os

class RAGRetriever:
    def __init__(self):
        try:
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.index = None
            self.chunks = []
        except Exception as e:
            print(f"Warning: Could not initialize embedding model: {e}")
            self.embedding_model = None
    
    def create_embeddings(self, file_path: str) -> bool:
        """Create embeddings from CSV file"""
        if not self.embedding_model:
            return False
            
        try:
            df = pd.read_csv(file_path)
            
            # Convert DataFrame to text chunks
            self.chunks = []
            for idx, row in df.iterrows():
                # Create a text representation of each row
                row_text = " | ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
                self.chunks.append(row_text)
            
            if not self.chunks:
                return False
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(self.chunks)
            
            # Create FAISS index
            dimension = embeddings.shape[1]
            self.index = faiss.IndexFlatIP(dimension)  # Inner product similarity
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            self.index.add(embeddings.astype('float32'))
            
            return True
            
        except Exception as e:
            print(f"Error creating embeddings: {e}")
            return False
    
    def retrieve_relevant_chunks(self, query: str, top_k: int = 3) -> List[str]:
        """Retrieve relevant chunks based on query"""
        if not self.embedding_model or not self.index or not self.chunks:
            return []
        
        try:
            # Encode query
            query_embedding = self.embedding_model.encode([query])
            faiss.normalize_L2(query_embedding)
            
            # Search for similar chunks
            scores, indices = self.index.search(query_embedding.astype('float32'), top_k)
            
            # Return relevant chunks
            relevant_chunks = []
            for idx in indices[0]:
                if idx < len(self.chunks):
                    relevant_chunks.append(self.chunks[idx])
            
            return relevant_chunks
            
        except Exception as e:
            print(f"Error retrieving chunks: {e}")
            return []
    
    def get_insights(self, file_path: str, query: str) -> str:
        """Get RAG-enhanced insights"""
        if not self.create_embeddings(file_path):
            return "RAG enhancement unavailable - proceeding with standard analysis"
        
        relevant_chunks = self.retrieve_relevant_chunks(query, top_k=3)
        
        if not relevant_chunks:
            return "No relevant context found for enhanced analysis"
        
        # Generate insights based on relevant chunks
        insights = ["Based on similar data patterns found:"]
        
        for i, chunk in enumerate(relevant_chunks, 1):
            # Extract key information from chunk
            chunk_insights = self._extract_insights_from_chunk(chunk, query)
            if chunk_insights:
                insights.append(f"{i}. {chunk_insights}")
        
        return "\n".join(insights) if len(insights) > 1 else "Context processed but no specific insights generated"
    
    def _extract_insights_from_chunk(self, chunk: str, query: str) -> str:
        """Extract insights from a data chunk"""
        query_lower = query.lower()
        chunk_lower = chunk.lower()
        
        # Look for relevant patterns
        insights = []
        
        if "sales" in query_lower and "sales" in chunk_lower:
            # Extract sales-related information
            if "region" in chunk_lower:
                insights.append("Regional sales pattern detected in historical data")
        
        if "product" in query_lower and "product" in chunk_lower:
            insights.append("Product performance data available for comparison")
        
        if "customer" in query_lower and "customer" in chunk_lower:
            insights.append("Customer behavior patterns found in similar records")
        
        # Ghana-specific insights
        if "ghana" in query_lower or "accra" in chunk_lower or "kumasi" in chunk_lower:
            insights.append("Ghana market context identified in data patterns")
        
        return "; ".join(insights) if insights else ""