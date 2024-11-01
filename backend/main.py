from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from langchainmodel.pdf_processor import process_pdf
import cloudinary.uploader # type: ignore
from config import cloudinary
from langchainmodel.nlp_processor import generate_answer
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, get_db # type: ignore
from models import PDFText
from schema import UploadResponse, QuestionRequest, AnswerResponse
from botocore.exceptions import NoCredentialsError

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()


# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:5173/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Testing
@app.get("/")
def home():
    return {"This is home"}

# Upload PDF Endpoint with logging
@app.post("/upload-pdf", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Check if the uploaded file is a PDF
    if not file.filename.endswith(".pdf") or file.content_type != "application/pdf": # type: ignore
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are allowed.")

    # Read the contents of the uploaded file
    contents = await file.read()

    # Process the PDF and extract the text
    text = process_pdf(contents)

    # Save the extracted text to PostgreSQL
    pdf_text = PDFText(filename=file.filename, text=text)
    db.add(pdf_text)
    db.commit()
    db.refresh(pdf_text)
     # Reset the file pointer to the beginning before uploading
    file.file.seek(0)  # Seek back to the start of the file

    # Upload PDF to Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(file.file, resource_type="raw")  # Upload as 'raw' for PDF
        pdf_url = upload_result.get("url")  # Retrieve the URL for the uploaded PDF
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload PDF to Cloudinary")
    
    # Return a success response
    return {
        "document_id": int(pdf_text.id), # type: ignore
        "filename": file.filename,
        "message": "File successfully processed and text extracted.",
        "pdf_url": pdf_url
    }


# Ask Question Endpoint
@app.post("/ask-question", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    # Retrieve the PDF text from the database based on the provided ID
    # print("came for answer")
    pdf_text = db.query(PDFText).filter(PDFText.id == request.text_id).first()
    # print("pdf text: ", pdf_text.text,"document_id: ",request.text_id) # type: ignore
    if not pdf_text:
        raise HTTPException(status_code=404, detail="PDF text not found")

    # Generate an answer to the question based on the PDF text
    answer = generate_answer(request.question, pdf_text.text) # type: ignore

    # Return the generated answer
    return {"answer": answer}











# from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
# from sqlalchemy.orm import Session
# import cloudinary.uploader # type: ignore
# import fitz  # type: ignore # PyMuPDF for text extraction
# from database import SessionLocal, Document
# from config import cloudinary
# import requests # type: ignore
# from fastapi.middleware.cors import CORSMiddleware
# import logging
# from langchain_openai import OpenAI
# from langchain.chains import LLMChain
# from langchain.prompts import PromptTemplate
# from langchain.chains.question_answering import load_qa_chain


# app = FastAPI()

# # Dependency for database session
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # CORS setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*", "http://localhost:5173/"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # testing
# @app.get("/")
# def home():
#     return {"This is home"}

# # Upload PDF Endpoint with logging
# @app.post("/upload-pdf")
# async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     try:
#         upload_result = cloudinary.uploader.upload(file.file, resource_type="raw")
#         pdf_url = upload_result.get("url")
#         filename = file.filename

#         new_document = Document(filename=filename, url=pdf_url)
#         db.add(new_document)
#         db.commit()
#         db.refresh(new_document)

#         response_data = {"filename": filename, "pdf_url": pdf_url, "document_id": new_document.id}
#         print("Response Data:", response_data)  # Log the response data
#         return response_data
#     except Exception as e:
#         print("Error uploading to Cloudinary:", e)
#         raise HTTPException(status_code=500, detail="Failed to upload PDF to Cloudinary")

# # Extract text from PDF
# def extract_text_from_pdf(pdf_url):
#     response = requests.get(pdf_url)
#     response.raise_for_status()
    
#     pdf_content = response.content
#     with fitz.open(stream=pdf_content, filetype="pdf") as pdf:
#         text = ""
#         for page in pdf:
#             text += page.get_text()
#     return text

# # Ask Question Endpoint
# @app.post("/ask-question")
# async def ask_question(document_id: int, question: str, db: Session = Depends(get_db)):
#     try:
#         document = db.query(Document).filter(Document.id == document_id).first()
#         if document is None:
#             raise HTTPException(status_code=404, detail="Document not found")

#         pdf_text = extract_text_from_pdf(document.url)
#         nlp_processor = LangChainNLP()
#         answer = nlp_processor.process_question(question, pdf_text)

#         return {"answer": answer}
#     except HTTPException as e:
#         raise e  # Directly raise HTTPExceptions with `detail`
#     except Exception as e:
#         print(f"Error processing request: {str(e)}")  # Log the error for debugging
#         raise HTTPException(status_code=500, detail="Internal Server Error")

