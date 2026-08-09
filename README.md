# Shortlist AI

Shortlist AI is a web application that uses Groq-hosted AI to compare multiple resumes against a job description. It extracts candidate information, scores each candidate, and explains the strongest matches and skill gaps.

## Features

- Paste a job description into the browser.
- Upload one or multiple PDF, DOCX, or TXT resumes.
- Parse candidate skills, experience, education, projects, and certifications.
- Rank candidates by overall role match.
- Show verdicts, strong points, and gaps for every candidate.

## Tech Stack

- Python 3.11+
- FastAPI and Uvicorn
- Groq API with Llama 3.3 70B
- Pydantic for structured AI responses
- PyPDF and python-docx for resume text extraction
- HTML, CSS, and vanilla JavaScript frontend
- uv for dependency and environment management

## Setup

Install [uv](https://docs.astral.sh/uv/) and create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

Install dependencies:

```powershell
uv sync
```

Start the web application:

```powershell
uv run uvicorn main:app --reload
```

Open http://127.0.0.1:8000 in a browser.

## How It Works

1. The job description is sent to the AI and converted into structured requirements.
2. Each uploaded resume is converted to text and parsed into a structured candidate profile.
3. The candidate profile is compared with the structured job requirements.
4. Results are sorted by match score and returned to the frontend with supporting details.

## Project Structure

```text
main.py             FastAPI app and upload endpoint
resume_parser.py    Resume extraction, parsing, and scoring logic
static/index.html   Browser interface
static/app.js       Upload workflow and result rendering
static/styles.css   Application styling
resumes/            Optional local sample resumes
```

## Security Note

Never commit `.env` or expose your API key. The repository ignores `.env` by default. Resume files may contain personal information, so use appropriate access controls when deploying this application.
