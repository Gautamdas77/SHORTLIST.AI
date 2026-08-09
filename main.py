from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from resume_parser import analyze_candidates

app = FastAPI(title="Shortlist AI")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def index():
    return FileResponse(Path("static/index.html"))


@app.post("/api/analyze")
async def analyze(job_description: str = Form(...), resumes: list[UploadFile] = File(...)):
    try:
        files = [(resume.filename or "resume.txt", await resume.read()) for resume in resumes]
        return {"candidates": analyze_candidates(job_description, files)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail=f"Analysis failed: {error}") from error


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)


if __name__ == "__main__":
    main()
