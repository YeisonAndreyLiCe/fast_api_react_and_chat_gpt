from fastapi import (
    FastAPI,
    File,
    UploadFile,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from decouple import config
import openai
from functions.openai_request import (
    convert_audio_to_text,
    get_chat_response,
)
from functions.database import (
    store_messages,
    reset_messages,
)
from functions.text_to_speech import convert_text_to_speech

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
async def check_health():
    return {"message": "Healthy"}


@app.post("/post-audio")
async def post_audio(file: UploadFile = File(...)):
    # message_decoded = convert_audio_to_text(open("audio.mp3", "rb"))

    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())

    audio_input = open(file.filename, "rb")
    message_decoded = convert_audio_to_text(audio_input)
    if not message_decoded:
        return HTTPException(status_code=400, detail="failed to decode message")

    chat_response = get_chat_response(message_decoded)

    if not chat_response:
        return HTTPException(status_code=400, detail="failed to get chat response")

    store_messages(message_decoded, chat_response)

    audio = convert_text_to_speech("chat_response")
    if not audio:
        return HTTPException(status_code=400, detail="failed to convert to audio")

    def iter_file():
        yield audio

    return StreamingResponse(iter_file(), media_type="application/octet-stream")


@app.get("/reset")
def reset():
    reset_messages()
    return {"message": "Messages reset"}


@app.post("/post-audio")
async def post_audio(audio: UploadFile = File(...)):
    if audio.content_type != "audio/wav":
        raise HTTPException(
            status_code=400, detail="Audio must be in .wav format")
