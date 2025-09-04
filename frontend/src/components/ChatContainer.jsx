import React, { useState, useEffect, useRef } from "react";
import localforage from "localforage";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import { sendMessageToAI } from "../services/aiService";
import Sidebar from "./SideBar";
import { CHAT_CONFIG, ERROR_MESSAGES } from "../constants";
import { createChatDataObject, generateChatTitle } from "../utils/formatters";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [chatHistories, setChatHistories] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState(
    CHAT_CONFIG.DEFAULT_TITLE
  );
  const messagesEndRef = useRef(null);

  // Load chat histories from localForage on mount
  useEffect(() => {
    localforage
      .getItem("chatHistories")
      .then((savedHistories) => {
        if (savedHistories && Array.isArray(savedHistories)) {
          setChatHistories(savedHistories);
        }
      })
      .catch((error) => {
        console.error("Error loading chat histories from localForage:", error);
      });
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to update chat histories in state and async storage
  const updateChatHistories = (newChatData) => {
    setChatHistories((prev) => {
      const existingIndex = prev.findIndex(
        (chat) => chat.id === newChatData.id
      );
      let updatedHistories;
      if (existingIndex >= 0) {
        updatedHistories = [...prev];
        updatedHistories[existingIndex] = newChatData;
      } else {
        updatedHistories = [newChatData, ...prev];
      }

      if (updatedHistories.length > CHAT_CONFIG.HISTORY_LIMIT) {
        updatedHistories = updatedHistories.slice(0, CHAT_CONFIG.HISTORY_LIMIT);
      }

      // Asynchronous storage write - does not block the main thread
      localforage.setItem("chatHistories", updatedHistories).catch((err) => {
        console.error("Failed to save chat histories:", err);
      });

      return updatedHistories;
    });
  };

  // Helper to display API error message in chat
  const handleApiError = (error) => {
    console.error("Error:", error);
    const errorMessage = {
      id: Date.now() + 1,
      text: ERROR_MESSAGES.AI_API_ERROR,
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  };

  // Helper to get a savable object of the current chat state
  const saveCurrentChat = () => {
    if (messages.length === 0) return null;
    const firstUserMessage = messages.find((m) => m.sender === "user");
    return createChatDataObject({
      chatId: currentChatId,
      currentTitle: currentChatTitle,
      firstMessageText: firstUserMessage?.text,
      messages,
      conversationHistory,
      existingChat: chatHistories.find((c) => c.id === currentChatId),
    });
  };

  const handleEditMessage = async (messageId, newText) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const isLastUserMessage =
      messageIndex === messages.findLastIndex((m) => m.sender === "user");
    if (!isLastUserMessage) return;

    const updatedMessage = {
      ...messages[messageIndex],
      text: newText,
      isRegenerated: true,
      timestamp: new Date(),
    };
    const messagesBeforeEdit = messages.slice(0, messageIndex);
    const updatedMessagesWithUserEdit = [...messagesBeforeEdit, updatedMessage];
    const conversationBeforeEdit = conversationHistory.slice(
      0,
      messageIndex * 2
    );

    setMessages(updatedMessagesWithUserEdit);
    setIsLoading(true);
    setConversationHistory(conversationBeforeEdit);

    try {
      const aiResponse = await sendMessageToAI(newText, conversationBeforeEdit);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessagesWithUserEdit, aiMessage];
      const newHistory = [
        ...conversationBeforeEdit,
        { role: "user", content: newText },
        { role: "assistant", content: aiResponse },
      ];

      setMessages(finalMessages);
      setConversationHistory(newHistory.slice(-CHAT_CONFIG.HISTORY_MAX_LENGTH));

      const chatData = createChatDataObject({
        chatId: currentChatId,
        currentTitle: currentChatTitle,
        firstMessageText: newText,
        messages: finalMessages,
        conversationHistory: newHistory,
        existingChat: chatHistories.find((c) => c.id === currentChatId),
      });
      updateChatHistories(chatData);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (inputText) => {
    if (!inputText.trim() || isLoading) return;
    setShowWelcome(false);

    let tempChatId = currentChatId;
    let tempChatTitle = currentChatTitle;
    if (messages.length === 0) {
      tempChatId = Date.now().toString();
      tempChatTitle = generateChatTitle(inputText);
      setCurrentChatId(tempChatId);
      setCurrentChatTitle(tempChatTitle);
    }

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(inputText, conversationHistory);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, aiMessage];
      const newHistory = [
        ...conversationHistory,
        { role: "user", content: inputText },
        { role: "assistant", content: aiResponse },
      ];

      setMessages(finalMessages);
      setConversationHistory(newHistory.slice(-CHAT_CONFIG.HISTORY_MAX_LENGTH));

      const chatData = createChatDataObject({
        chatId: tempChatId,
        currentTitle: tempChatTitle,
        firstMessageText: inputText,
        messages: finalMessages,
        conversationHistory: newHistory,
        existingChat: chatHistories.find((c) => c.id === tempChatId),
      });
      updateChatHistories(chatData);
    } catch (error) {
      handleApiError(error);
      setMessages(newMessages); // Rollback to only show user message on API error
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setCurrentChatId(null);
    setCurrentChatTitle(CHAT_CONFIG.DEFAULT_TITLE);
    setShowWelcome(true);
  };

  const newChat = () => {
    const currentChat = saveCurrentChat();
    if (currentChat) {
      updateChatHistories(currentChat);
    }
    clearChat();
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  const loadChatFromHistory = (chatData) => {
    setMessages(chatData.messages || []);
    setConversationHistory(chatData.conversationHistory || []);
    setCurrentChatId(chatData.id);
    setCurrentChatTitle(chatData.title);
    setShowWelcome(false);
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  const deleteChatFromHistory = (chatId) => {
    const updatedHistories = chatHistories.filter((chat) => chat.id !== chatId);
    setChatHistories(updatedHistories);
    localforage.setItem("chatHistories", updatedHistories);
    if (currentChatId === chatId) {
      clearChat();
    }
  };

  const deleteAllChatHistories = () => {
    setChatHistories([]);
    localforage.removeItem("chatHistories");
    clearChat();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex overflow-hidden">
      <Sidebar
        onNewChat={newChat}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        chatHistories={chatHistories}
        onLoadChat={loadChatFromHistory}
        onDeleteChat={deleteChatFromHistory}
        onDeleteAllChats={deleteAllChatHistories}
        currentChatId={currentChatId}
        conversationCount={conversationHistory.length / 2}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col p-0 sm:p-2 max-w-full overflow-hidden">
          <div className="flex-1 bg-white sm:rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="lg:hidden bg-white border-b border-gray-100 p-3 flex items-center justify-center flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {currentChatTitle}
              </h2>
            </div>
            <div className="hidden lg:block bg-white border-b border-gray-100 p-3">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentChatTitle}
              </h2>
            </div>
            <MessageList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              showWelcome={showWelcome}
              onEditMessage={handleEditMessage}
            />
            <InputArea
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
