// components/Modal.tsx
import React, { useState, useEffect, useRef } from "react";
import "./ChatModal.styles.css";
import "../assets/main.css";
import GenerateIcon from "./icons/GenerateIcon";
import RegenerateIcon from "./icons/RegenerateIcon";
import InsertIcon from "./icons/InsertIcon";

interface ModalProps {
  onInsert: (reply: string) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onInsert, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);

  const [conversation, setConversation] = useState<{ messageType: 'prompt' | 'reply'; message: string }[]>([]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const replyBox = document.querySelector(
    ".msg-form__contenteditable"
  ) as HTMLElement;
  const placeholder = document.querySelector(
    ".msg-form__placeholder"
  ) as HTMLElement;

  console.log("replyBox", replyBox);
  console.log("placeholder", placeholder);

  const [generatedReply, setGeneratedReply] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  const generateReply = () => {
    const reply =
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
    setGeneratedReply(reply);

    setConversation(prev => [
      ...prev, 
      { messageType: 'prompt', message: prompt }, 
      { messageType: 'reply', message: reply }
    ]);

    setPrompt("");
  };

  // Close modal when clicking outside of it
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("conversation", conversation);
    
  })

  return (
    <div>
      {/* Backdrop */}
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[1000]" />
      <div
        ref={modalRef}
        className={`chat-modal-animate ${isMounted ? 'slide-in-modal' : ''} fixed top-1/2 left-[49%] bg-[#fff] p-6 z-[2000] flex flex-col gap-6 w-[550px] transform -translate-x-1/2 -translate-y-1/2 shadow-md rounded-2xl`}
      >
        {/* Section to display prompt and generated reply */}
        <div className="flex flex-col gap-2.5 pb-2.5">
          {conversation.map((message, index) => {
            console.log(message);
            
            return(
            <div key={index} className={`${message.messageType === 'prompt' ? 'bg-gray-100 ml-auto flex-wrap break-words text-wrap' : 'text-left bg-[#DBEAFE] p-3 rounded-xl max-w-[70%] w-auto'} p-3 rounded-xl max-w-[70%] slide-in-reply slide-in`}>{message.message}</div>
          )})}
        </div>

        <input
          className="w-full p-2.5 rounded-lg active:outline-none focus:outline-none"
          placeholder="Your Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex justify-end gap-5">
          {generatedReply && (
            <button
              className="text-gray-500 rounded-lg px-6 py-3 gap-2.5 cursor-pointer border border-gray-500 border-solid flex justify-center items-center"
              onClick={() => onInsert(generatedReply)}
            >
              <span>
                <InsertIcon height="16px" width="16px" />
              </span>
              <span>Insert</span>
            </button>
          )}
          <button
            className="text-white rounded-lg px-6 py-3 gap-2.5 cursor-pointer bg-[#3B82F6] flex justify-center items-center"
            onClick={generatedReply ? () => "" : generateReply}
          >
            <span>
              {generatedReply ? (
                <RegenerateIcon height="16px" width="16px" />
              ) : (
                <GenerateIcon height="16px" width="16px" />
              )}
            </span>
            <span>{generatedReply ? "Regenerate" : "Generate"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
