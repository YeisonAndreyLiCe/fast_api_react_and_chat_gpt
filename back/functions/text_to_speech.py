import requests
from decouple import config

ELEVEN_LABS_KEY = config("ELEVEN_LABS_API_KEY")


def convert_text_to_speech(message):
    body = {
        "text": message,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0,
            "similarity_boost": 0,
            "style": 0,
            "use_speaker_boost": True
        }
    }

    voice_rachel = "XrExE9yKIg1WjnnlVkGX"  # "21m00Tcm4TlvDq8ikWAM"

    headers = {
        "xi-api-key": ELEVEN_LABS_KEY,
        "Content-Type": "application/json",
        "accept": "audio/mpeg",
    }
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_rachel}"

    try:
        response = requests.post(
            endpoint,
            headers=headers,
            json=body,
        )
        response.raise_for_status()
        return response.content
    except Exception as exc:
        print(exc)
        return None
