// src/components/InputArea.jsx
import React, { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { TEXTAREA_STYLE } from "../constants";

const InputArea = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const minHeight =
        window.innerWidth < 640
          ? TEXTAREA_STYLE.MIN_HEIGHT_MOBILE
          : TEXTAREA_STYLE.MIN_HEIGHT_DESKTOP;
      const maxHeight =
        window.innerWidth < 640
          ? TEXTAREA_STYLE.MAX_HEIGHT_MOBILE
          : TEXTAREA_STYLE.MAX_HEIGHT_DESKTOP;
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);
    return () => window.removeEventListener("resize", adjustTextareaHeight);
  }, []);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-gray-50 p-2 sm:p-4 flex-shrink-0">
      <div className="flex items-end space-x-2 sm:space-x-3">
        <div className="flex-1 min-w-0">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda di sini..."
            className="w-full resize-none border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base overflow-y-auto"
            disabled={isLoading}
            style={{
              height: "auto",
              minHeight:
                window.innerWidth < 640
                  ? `${TEXTAREA_STYLE.MIN_HEIGHT_MOBILE}px`
                  : `${TEXTAREA_STYLE.MIN_HEIGHT_DESKTOP}px`,
              maxHeight:
                window.innerWidth < 640
                  ? `${TEXTAREA_STYLE.MAX_HEIGHT_MOBILE}px`
                  : `${TEXTAREA_STYLE.MAX_HEIGHT_DESKTOP}px`,
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center self-center"
        >
          <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1 sm:mt-2 px-1 hidden sm:block">
        Tekan Enter untuk mengirim pesan, Shift+Enter untuk baris baru
      </p>
    </div>
  );
};

export default InputArea;
