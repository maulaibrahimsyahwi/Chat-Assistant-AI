import React from "react";
import Message from "./Message";
import LoadingIndicator from "./LoadingIndicator";
import WelcomeMessage from "./WelcomeMessage";

const MessageList = ({
  messages,
  isLoading,
  messagesEndRef,
  showWelcome,
  onEditMessage,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {showWelcome && messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message, index) => {
            // Tentukan apakah ini adalah pesan user terakhir
            const isLastUserMessage =
              message.sender === "user" &&
              index === messages.findLastIndex((m) => m.sender === "user");

            return (
              <Message
                key={message.id}
                message={message}
                onEditMessage={onEditMessage}
                isLastUserMessage={isLastUserMessage}
              />
            );
          })}
          {isLoading && <LoadingIndicator />}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
