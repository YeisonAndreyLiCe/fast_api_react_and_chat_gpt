import json
import random

import logging

LOGGER = logging.getLogger(__name__)


def get_recent_messages():
    file_name: str = "stored_data.json"
    learn_instructions: dict[str, str] = {
        "role": "system",
        "content": f"""You are interviewing the user for a job as a programmer.
            Ask short questions that are relevant to the junior position.
            Your name is Rachel. The user is called Yeison.
            keep your answers to under 30 words.""",
    }

    messages = []

    x = random.uniform(0, 1)
    if x < 0.5:
        learn_instructions["content"] = (
            learn_instructions["content"]
            + "Your response will include some dry humor")
    else:
        learn_instructions["content"] = (
            learn_instructions["content"]
            + "Your response will include a rather challenging question")

    messages.append(learn_instructions)

    try:
        with open(file_name, "r") as file:
            data = json.load(file)
            if data:
                if len(messages) > 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except Exception as exc:
        LOGGER.error(exc)

    return messages


def store_messages(request_message, response_message):
    FILE_NAME = "stored_data.json"
    messages = get_recent_messages()[1:]
    messages.append({"role": "user", "content": request_message})
    messages.append({"role": "assistant", "content": response_message})

    with open(FILE_NAME, "w") as file:
        json.dump(messages, file, indent=2)


def reset_messages() -> None:
    with open("stored_data.json", "w") as file:
        json.dump([], file, indent=2)
