import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import { sendMessageToAI } from "../services/aiService";
import Sidebar from "./SideBar";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // State untuk manajemen chat history
  const [chatHistories, setChatHistories] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState("Chat Baru");

  const messagesEndRef = useRef(null);

  // Load chat histories dari localStorage saat komponen mount
  useEffect(() => {
    const savedHistories = localStorage.getItem("chatHistories");
    if (savedHistories) {
      try {
        setChatHistories(JSON.parse(savedHistories));
      } catch (error) {
        console.error("Error loading chat histories:", error);
      }
    }

    // Listen for custom event untuk update chat histories
    const handleChatHistoriesUpdate = () => {
      const updatedHistories = localStorage.getItem("chatHistories");
      if (updatedHistories) {
        try {
          setChatHistories(JSON.parse(updatedHistories));
        } catch (error) {
          setChatHistories([]);
        }
      } else {
        setChatHistories([]);
      }
    };

    window.addEventListener("chatHistoriesUpdated", handleChatHistoriesUpdate);

    return () => {
      window.removeEventListener(
        "chatHistoriesUpdated",
        handleChatHistoriesUpdate
      );
    };
  }, []);

  // Auto-collapse sidebar on mobile by default
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function untuk generate title otomatis dari pesan pertama
  const generateChatTitle = (firstMessage) => {
    if (!firstMessage) return "Chat Baru";

    // Ambil 60 karakter pertama dan hapus spasi di awal/akhir
    let title = firstMessage.trim().substring(0, 60);

    // Jika lebih dari 60 karakter, tambahkan "..."
    if (firstMessage.trim().length > 60) {
      title += "...";
    }

    // Pastikan title tidak kosong setelah trim
    return title || "Chat Baru";
  };

  // Function untuk menyimpan chat saat ini
  const saveCurrentChat = () => {
    if (messages.length === 0) return null;

    const chatId = currentChatId || Date.now().toString();

    // Ambil pesan user pertama untuk membuat title
    const firstUserMessage = messages.find((m) => m.sender === "user");
    const chatTitle =
      currentChatTitle === "Chat Baru" && firstUserMessage
        ? generateChatTitle(firstUserMessage.text)
        : currentChatTitle;

    const chatData = {
      id: chatId,
      title: chatTitle,
      messages: messages,
      conversationHistory: conversationHistory,
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messageCount: messages.length,
    };

    return chatData;
  };

  // Function untuk update chat histories di localStorage
  const updateChatHistories = (newChatData) => {
    setChatHistories((prev) => {
      const existingIndex = prev.findIndex(
        (chat) => chat.id === newChatData.id
      );
      let updatedHistories;

      if (existingIndex >= 0) {
        // Update existing chat
        updatedHistories = [...prev];
        updatedHistories[existingIndex] = newChatData;
      } else {
        // Add new chat to beginning
        updatedHistories = [newChatData, ...prev];
      }

      // Limit to 50 chats maximum
      if (updatedHistories.length > 50) {
        updatedHistories = updatedHistories.slice(0, 50);
      }

      // Save to localStorage
      localStorage.setItem("chatHistories", JSON.stringify(updatedHistories));

      return updatedHistories;
    });
  };

  // Function untuk handle edit message
  const handleEditMessage = async (messageId, newText) => {
    // Cari index pesan yang akan diedit
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Pastikan ini adalah pesan user terakhir
    const isLastUserMessage =
      messages[messageIndex].sender === "user" &&
      messageIndex === messages.findLastIndex((m) => m.sender === "user");

    if (!isLastUserMessage) return;

    // Update pesan dengan text baru dan tandai sebagai regenerated
    const updatedMessage = {
      ...messages[messageIndex],
      text: newText,
      isRegenerated: true,
      timestamp: new Date(),
    };

    // Hapus semua pesan setelah pesan yang diedit (termasuk response AI)
    const messagesBeforeEdit = messages.slice(0, messageIndex);
    const newMessages = [...messagesBeforeEdit, updatedMessage];

    setMessages(newMessages);
    setIsLoading(true);

    // Update conversation history - hapus percakapan setelah pesan yang diedit
    const conversationBeforeEdit = conversationHistory.slice(0, messageIndex);
    setConversationHistory(conversationBeforeEdit);

    try {
      // Kirim pesan yang sudah diedit ke AI
      const aiResponse = await sendMessageToAI(newText, conversationBeforeEdit);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const finalMessages = [...prev, aiMessage];

        // Auto-save chat setelah edit dan AI response
        setTimeout(() => {
          const chatTitle =
            currentChatTitle === "Chat Baru"
              ? generateChatTitle(newText)
              : currentChatTitle;

          const currentChat = {
            id: currentChatId,
            title: chatTitle,
            messages: finalMessages,
            conversationHistory: [
              ...conversationBeforeEdit,
              { role: "user", content: newText },
              { role: "assistant", content: aiResponse },
            ],
            timestamp: currentChatId
              ? chatHistories.find((c) => c.id === currentChatId)?.timestamp ||
                new Date().toISOString()
              : new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            messageCount: finalMessages.length,
          };

          updateChatHistories(currentChat);
        }, 100);

        return finalMessages;
      });

      // Update conversation history dengan percakapan baru
      setConversationHistory((prev) => {
        const newHistory = [
          ...conversationBeforeEdit,
          { role: "user", content: newText },
          { role: "assistant", content: aiResponse },
        ];

        if (newHistory.length > 20) {
          return newHistory.slice(-20);
        }
        return newHistory;
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (inputText) => {
    if (!inputText.trim() || isLoading) return;

    if (showWelcome) {
      setShowWelcome(false);
    }

    // Jika ini pesan pertama di chat baru, set title dan ID
    if (messages.length === 0) {
      const newChatId = Date.now().toString();
      const newTitle = generateChatTitle(inputText);
      setCurrentChatId(newChatId);
      setCurrentChatTitle(newTitle);
    }

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToAI(inputText, conversationHistory);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, aiMessage];

        // Auto-save chat setelah AI response
        setTimeout(() => {
          const chatTitle =
            currentChatTitle === "Chat Baru"
              ? generateChatTitle(inputText)
              : currentChatTitle;

          const currentChat = {
            id: currentChatId,
            title: chatTitle,
            messages: newMessages,
            conversationHistory: [
              ...conversationHistory,
              { role: "user", content: inputText },
              { role: "assistant", content: aiResponse },
            ],
            timestamp: currentChatId
              ? chatHistories.find((c) => c.id === currentChatId)?.timestamp ||
                new Date().toISOString()
              : new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            messageCount: newMessages.length,
          };

          updateChatHistories(currentChat);
        }, 100);

        return newMessages;
      });

      // Update conversation history
      setConversationHistory((prev) => {
        const newHistory = [
          ...prev,
          { role: "user", content: inputText },
          { role: "assistant", content: aiResponse },
        ];

        if (newHistory.length > 20) {
          return newHistory.slice(-20);
        }
        return newHistory;
      });
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setCurrentChatId(null);
    setCurrentChatTitle("Chat Baru");
    setShowWelcome(true);
  };

  const newChat = () => {
    // Simpan chat saat ini sebelum membuat yang baru
    if (messages.length > 0) {
      const currentChat = saveCurrentChat();
      if (currentChat) {
        updateChatHistories(currentChat);
      }
    }

    // Reset untuk chat baru
    clearChat();

    // Auto-collapse sidebar on mobile after creating new chat
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  // Function untuk load chat dari history
  const loadChatFromHistory = (chatData) => {
    setMessages(chatData.messages || []);
    setConversationHistory(chatData.conversationHistory || []);
    setCurrentChatId(chatData.id);
    setCurrentChatTitle(chatData.title);
    setShowWelcome(false);

    // Auto-collapse sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  // Function untuk delete chat dari history
  const deleteChatFromHistory = (chatId) => {
    setChatHistories((prev) => {
      const updatedHistories = prev.filter((chat) => chat.id !== chatId);
      localStorage.setItem("chatHistories", JSON.stringify(updatedHistories));
      return updatedHistories;
    });

    // Jika chat yang dihapus adalah chat aktif, clear current chat
    if (currentChatId === chatId) {
      clearChat();
    }
  };

  // Function untuk menghapus semua riwayat chat
  const deleteAllChatHistories = () => {
    try {
      // Clear state chatHistories
      setChatHistories([]);

      // Clear localStorage
      localStorage.removeItem("chatHistories");

      // Clear current chat jika ada
      clearChat();

      console.log("All chat histories deleted successfully");
    } catch (error) {
      console.error("Error deleting all chat histories:", error);
    }
  };

  return (
    // Menggunakan h-screen dengan posisi fixed untuk memastikan tidak ada ruang kosong
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onClearChat={clearChat}
        onNewChat={newChat}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        messageCount={messages.length}
        conversationCount={conversationHistory.length / 2}
        chatHistories={chatHistories}
        onLoadChat={loadChatFromHistory}
        onDeleteChat={deleteChatFromHistory}
        onDeleteAllChats={deleteAllChatHistories}
        currentChatId={currentChatId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col p-0 sm:p-4 max-w-full overflow-hidden">
          <div className="flex-1 bg-white sm:rounded-xl shadow-lg overflow-hidden flex flex-col">
            {/* Header area in chat */}
            <div className="lg:hidden bg-white border-b border-gray-100 p-3 flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentChatTitle}
                </h2>
              </div>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block bg-white border-b border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentChatTitle}
                  </h2>
                </div>
              </div>
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
