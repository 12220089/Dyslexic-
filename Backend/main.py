# from fastapi import FastAPI
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from transformers import T5ForConditionalGeneration, T5Tokenizer
# from datasets import load_dataset
# from wordfreq import zipf_frequency
# from nltk.stem import WordNetLemmatizer
# import nltk

# # ----------------- Download NLTK data -----------------
# nltk.download('wordnet')

# # ----------------- Initialize FastAPI -----------------
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # your React frontend URL
#     allow_methods=["*"],
#     allow_headers=["*"],
#     allow_credentials=True,
# )

# # ----------------- Request Schema -----------------
# class TextRequest(BaseModel):
#     text: str

# # ----------------- Load Trained T5 Model -----------------
# model_path = r"C:\Users\CTT\Desktop\dyslexia-text-rewriter\t5_simplify_final_zip"  # raw string
#  # path to your unzipped model folder
# tokenizer = T5Tokenizer.from_pretrained(model_path)
# model = T5ForConditionalGeneration.from_pretrained(model_path)

# # ----------------- Load LM-Lexicon Dataset -----------------
# dataset = load_dataset("LM-Lexicon/Wordnet")
# lexicon_dict = {}
# for row in dataset['train']:
#     word = row['term'].lower()
#     synonyms = row.get('simplified_words', [])
#     definition = row.get('definition', "")
#     lexicon_dict[word] = {'synonyms': synonyms, 'definition': definition}

# # ----------------- Initialize Lemmatizer -----------------
# lemmatizer = WordNetLemmatizer()

# # ----------------- Helper Functions -----------------
# def is_complex(word):
#     """Detect complex word based on word frequency"""
#     return zipf_frequency(word, "en") < 4.0

# def get_easy_explanation(word):
#     """Return easy synonyms or definition"""
#     word_lower = word.lower()
#     # Try lemma for noun and verb
#     candidates = [
#         word_lower,
#         lemmatizer.lemmatize(word_lower, pos='n'),
#         lemmatizer.lemmatize(word_lower, pos='v')
#     ]
#     for w in candidates:
#         if w in lexicon_dict:
#             syns = lexicon_dict[w].get('synonyms', [])
#             definition = lexicon_dict[w].get('definition', "")
#             if syns:
#                 return syns[:3]
#             elif definition:
#                 return [definition]
#     return []

# # ----------------- Simplify Endpoint -----------------
# @app.post("/simplify")
# def simplify_text(data: TextRequest):
#     text = data.text

#     # Prepare input for T5
#     input_text = "simplify: " + text
#     inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)

#     # Generate simplified text
#     outputs = model.generate(inputs, max_new_tokens=128, num_beams=4, early_stopping=True)
#     simplified = tokenizer.decode(outputs[0], skip_special_tokens=True)

#     # Identify complex words in simplified text
#     words = simplified.split()
#     complex_words = {w: get_easy_explanation(w) for w in words if is_complex(w)}

#     return {
#         "simplified": simplified,
#         "complex_words": complex_words
#     }

# # ----------------- Root Endpoint -----------------
# @app.get("/")
# def read_root():
#     return {"message": "T5 Simplification API is running!"}

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import T5ForConditionalGeneration, T5Tokenizer
import re, requests
import sentencepiece

# ----------------- Initialize FastAPI -----------------
origins = [
    "https://dyslexic-198o.onrender.com",
    "http://localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------- Request Schema -----------------
class TextRequest(BaseModel):
    text: str

# ----------------- Load Trained T5 Model -----------------
model_path = r"C:\Users\CTT\Desktop\dyslexia-text-rewriter\t5_simplify_final_zip"  # path to saved model
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path)

# ----------------- Lexical Gap Functions -----------------
def find_candidate_words(original_text: str):
    tokens = re.findall(r"\b[\w'-]+\b", original_text)
    candidates = set()
    for t in tokens:
        clean = t.strip("'\"").lower()
        if len(clean) >= 7 and not clean.isdigit():
            candidates.add(clean)
    return list(candidates)

def datamuse_synonyms(word: str, max_results: int = 5):
    url = "https://api.datamuse.com/words"
    params = {"rel_syn": word, "max": max_results}
    try:
        r = requests.get(url, params=params, timeout=8)
        r.raise_for_status()
        return [item["word"] for item in r.json()]
    except Exception:
        return []

def get_definition_dictionaryapi(word: str):
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    try:
        r = requests.get(url, timeout=8)
        if not r.ok:
            return None
        data = r.json()
        if isinstance(data, list) and data:
            entry = data[0]
            meanings = entry.get("meanings", [])
            if meanings:
                defs = meanings[0].get("definitions", [])
                if defs:
                    definition = defs[0].get("definition")
                    example = defs[0].get("example")
                    return {"definition": definition, "example": example}
        return None
    except Exception:
        return None

# ----------------- Simplify Endpoint -----------------
@app.post("/simplify")
def simplify_text(data: TextRequest):
    text = data.text

    # T5 Simplification
    input_text = "simplify: " + text
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    outputs = model.generate(inputs, max_new_tokens=256, num_beams=4, early_stopping=True)
    simplified = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Lexical Gap Detection on original text
    words = find_candidate_words(text)
    lexical_gaps = {}
    for w in words:
        syns = datamuse_synonyms(w)
        defn = get_definition_dictionaryapi(w)
        lexical_gaps[w] = {
            "synonyms": syns if syns else None,
            "definition": defn["definition"] if defn else None,
            "example": defn["example"] if defn else None
        }

    return {
        "simplified": simplified,
        "lexical_gaps": lexical_gaps
    }

# ----------------- Root Endpoint -----------------
@app.get("/")
def read_root():
    return {"message": "T5 Simplification API running with lexical gap detection!"}
