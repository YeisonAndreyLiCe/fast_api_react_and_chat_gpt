import { useState } from "react";
import { Title } from "./Title";
import { RecordMessage } from "./RecordMessage";
import axios from "axios";
import { ApiUrl } from "../utils/context";

interface IMessage {
  sender: string;
  blobUrl: string;
}

const Controller = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const createBlobUrl = (data: any) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleStop = async (blobUrl: string) => {
    setLoading(true);
    const message = { sender: "me", blobUrl };
    const messagesArray = [...messages, message];

    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "audio.wav");

        await axios
          .post(`${ApiUrl}/post-audio`, formData, {
            headers: {
              "Content-Type": "audio/mpeg",
            },
            responseType: "arraybuffer",
          })
          .then((res) => {
            const blob = res.data;
            const src = createBlobUrl(blob);
            const audio = new Audio(src);

            const assistantMessage = {
              sender: "assistant",
              blobUrl: src,
            };

            messagesArray.push(assistantMessage);
            setMessages(messagesArray);

            setLoading(false);
            audio.play();
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
            return err;
          });
      });
  };

  return (
    <div className={"h-screen overflow-y-hidden"}>
      <Title setMessages={setMessages} />
      <div
        className={
          "flex flex-col justify-between h-full overflow-y-scroll pb-96"
        }
      >
        <div className={"mt-5 px-5"}>
          {messages.map(
            (message, index): JSX.Element => (
              <div
                key={index + message.sender}
                className={`flex flex-col ${
                  message.sender === "me"
                    ? "flex items-start"
                    : "flex items-end"
                }`}
              >
                <div className={"mt-4"}>
                  <p
                    className={
                      message.sender === "me"
                        ? "ml-2 italic text-blue-500"
                        : "text-right mr-2 italic text-green-500"
                    }
                  >
                    {message.sender}
                  </p>
                  <audio
                    src={message.blobUrl}
                    className={"appearance-none"}
                    controls
                  />
                </div>
              </div>
            )
          )}
          {loading ? (
            <div className={"text-center font-light italic mt-10"}>
              <p className={"text-2xl text-gray-500 font-light"}>
                {"Loading..."}
              </p>
            </div>
          ) : undefined}
          {messages.length === 0 && !loading ? (
            <div className={"flex justify-center items-center h-96"}>
              <p className={"text-2xl text-gray-500 font-light"}>
                {"No messages yet"}
              </p>
            </div>
          ) : undefined}
        </div>
        <div
          className={
            "fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-sky-500 to-green-500"
          }
        >
          <div className={"flex justify-center items-center w-full"}>
            <RecordMessage handleStop={handleStop} />
          </div>
        </div>
      </div>
      <h1>Controller</h1>
    </div>
  );
};

export { Controller };

export type { IMessage };
