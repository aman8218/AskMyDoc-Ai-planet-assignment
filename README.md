# AskMyDoc

"A Chat application which takes pdf as input and than extract text from that and than we can query about the provided context of pdf. I have used langchain_google_genai model for questioning and answering powered by FastAPI, PostgreSQL, and React."

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Contributing](#contributing)
9. [License](#license)

---

## Project Overview

"This application allows users to upload PDF documents, extract and query text content, and receive AI-generated answers based on the document's contents."

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: FastAPI, SQLAlchemy, Cloudinary (for file storage)
- **Database**: PostgreSQL
- **Other**: dotenv, Cloudinary API, LangChain for text processing

## Features

- PDF upload and storage on Cloudinary
- Text extraction and saving to PostgreSQL
- Query-based text analysis with AI-generated responses
- Flash messages and error handling for seamless user experience
- user interactive ui

---

## Installation

### Prerequisites

- **Node.js** (for frontend)
- **Python** (for backend with FastAPI)
- **PostgreSQL** (as the database)
- **Cloudinary Account** (for file storage)

### Backend Installation

1. Clone the repository:
    ```bash
    git clone  https://github.com/aman8218/AskMyDoc-Ai-planet-assignment.git
    cd AskMyDoc-Ai planet assignment/backend
    ```

2. Set up a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Set up your PostgreSQL database and update the connection string in `.env`.

5. Run the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend Installation

1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm run dev
    ```

---

## Environment Variables

Create a `.env` file in both the frontend and backend directories with the following environment variables.

### Backend `.env`:

```fill these variables in .env file 
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
GOOGLE_API_KEY=
