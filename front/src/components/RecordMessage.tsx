import { ReactMediaRecorder } from "react-media-recorder";
import { RecordIcon } from "./RecordIcon";

interface IRecordMessageProps {
  isRecording?: boolean;
  handleStop: (url: string) => Promise<void>;
}

const RecordMessage = ({ handleStop }: IRecordMessageProps) => {
  return (
    <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ startRecording, stopRecording, status }) => (
        <div className={"mt-2"}>
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className={"bg-white p-4 rounded-full"}
          >
            <RecordIcon status={status} />
          </button>
          <p className={"mt-2 text-white font-light"}>{status}</p>
        </div>
      )}
    />
  );
};

export { RecordMessage };
