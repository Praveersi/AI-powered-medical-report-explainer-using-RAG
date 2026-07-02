from sentence_transformers import SentenceTransformer
import time

print("Loading model (first time downloads ~90MB)...")
start = time.time()
model = SentenceTransformer('all-MiniLM-L6-v2')
print(f"Loaded in {time.time() - start:.1f}s\n")

# Embed a few sample sentences
sentences = [
    "Haemoglobin level is 9.2 g/dL which is below normal range",
    "Why is my Hb low?",
    "What is the price of milk today?"
]

embeddings = model.encode(sentences)

print(f"Embedding shape: {embeddings.shape}")
print(f"Each vector has {embeddings.shape[1]} numbers\n")

# Compare similarity — sentence 1 and 2 are related, 3 is not
from sklearn.metrics.pairwise import cosine_similarity
sim_1_2 = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
sim_1_3 = cosine_similarity([embeddings[0]], [embeddings[2]])[0][0]

print(f"Similarity (Hb sentence vs Hb question): {sim_1_2:.3f}")
print(f"Similarity (Hb sentence vs milk question): {sim_1_3:.3f}")