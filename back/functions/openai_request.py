import openai
from decouple import config
import logging
from fastapi import File

from functions.database import get_recent_messages

LOGGER = logging.getLogger(__name__)

openai.api_key = config("OPEN_AI_KEY")
openai.organization = config("OPEN_AI_ORG")


def convert_audio_to_text(audio: File) -> str | None:
    try:
        transcription = openai.Audio.transcribe(
            "whisper-1",
            audio,
            language="en",
        )
        message_text = transcription["text"]
        return message_text
    except Exception as error:
        LOGGER.error(error)
        return None


def get_chat_response(message_input: str) -> str:
    messages = get_recent_messages()
    user_message: dict[str, str] = {"role": "user", "content": message_input}
    messages.append(user_message)
    print("messages -- 1", messages)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
        )
        print("response --1", response)
        message_text: str = response["choices"][0]["message"]["content"]
        return message_text
    except Exception as exc:
        print(exc)
