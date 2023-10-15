import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import axios from "axios";
import { ApiUrl } from "../utils/context";
import { IMessage } from "./Controller";

interface ITitleProps {
  setMessages: Dispatch<SetStateAction<IMessage[]>>;
}

const Title = ({ setMessages }: ITitleProps): JSX.Element => {
  const [isResetting, setIsResetting] = useState(false);
  const handleReset = async () => {
    setIsResetting(true);
    await axios
      .get(`${ApiUrl}/reset`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to reset");
        }
        setMessages([]);
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    setIsResetting(false);
  };

  return (
    <div
      className={
        "flex justify-between items-center w-full p4 bg-gray-900 text-white font-bold shadow"
      }
    >
      <div className={"italic"}>{"Rachel"}</div>
      <button
        onClick={handleReset}
        className={`transition-all duration-300 text-blue-300 hover:text-pink-500
          ${isResetting ? "animate-pulse" : "cursor-pointer"}`}
      >
        <svg
          xmlns={"http://www.w3.org/2000/svg"}
          className={`h-8 w-8 ${isResetting ? "animate-spin" : ""}`}
          viewBox={"0 0 24 24"}
          strokeWidth={1.5}
          stroke={"currentColor"}
          fill="currentColor"
        >
          <path
            strokeLinecap={"round"}
            strokeLinejoin={"round"}
            d={"M0 0h24v24H0z"}
          />
        </svg>
      </button>
    </div>
  );
};

export { Title };
