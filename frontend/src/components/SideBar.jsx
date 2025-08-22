import React, { useState } from "react";
import {
  Menu,
  X,
  Trash2,
  Bot,
  MessageSquare,
  Settings,
  HelpCircle,
  Plus,
  History,
  Brain,
  Clock,
  MoreVertical,
  Archive,
} from "lucide-react";

// Import fungsi date formatting yang sudah diperbaiki
const ensureDate = (timestamp) => {
  if (!timestamp) return new Date();

  if (timestamp instanceof Date) {
    return timestamp;
  }

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    console.warn("Invalid timestamp:", timestamp);
    return new Date();
  }

  return date;
};

const formatDate = (timestamp) => {
  try {
    const date = ensureDate(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Kemarin";
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  } catch (error) {
    console.error("Error formatting sidebar date:", error);
    return "Tidak diketahui";
  }
};

const Sidebar = ({
  onClearChat,
  onNewChat,
  collapsed,
  onToggle,
  messageCount,
  conversationCount = 0,
  chatHistories = [],
  onLoadChat,
  onDeleteChat,
  onDeleteAllChats,
  currentChatId,
}) => {
  const [activeMenu, setActiveMenu] = useState("chat");
  const [showChatOptions, setShowChatOptions] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  // Fungsi untuk handle toggle sidebar - langsung tutup tanpa kembali ke panel utama
  const handleSidebarToggle = () => {
    // Langsung toggle collapse/expand sidebar
    onToggle();
    // Reset ke panel chat ketika sidebar ditutup
    if (!collapsed) {
      setActiveMenu("chat");
    }
  };

  // Fungsi untuk handle menu navigation dengan check collapsed state
  const handleMenuNavigation = (menuId) => {
    if (collapsed) {
      // Jika sidebar collapsed, buka sidebar terlebih dahulu dan set menu
      onToggle();
      setActiveMenu(menuId);
    } else {
      // Jika sidebar terbuka, toggle menu seperti biasa
      setActiveMenu(activeMenu === menuId ? "chat" : menuId);
    }
  };

  const menuItems = [
    {
      id: "new",
      icon: Plus,
      label: "Chat Baru",
      action: onNewChat,
      color: "text-green-600 hover:text-green-700 hover:bg-green-50",
      active: true,
    },
    {
      id: "clear",
      icon: Trash2,
      label: "Hapus Chat",
      action: onClearChat,
      color: "text-red-600 hover:text-red-700 hover:bg-red-50",
      disabled: messageCount === 0,
      active: true,
    },
    {
      id: "history",
      icon: History,
      label: "Riwayat Chat",
      action: () => handleMenuNavigation("history"),
      color: "text-gray-600 hover:text-gray-700 hover:bg-gray-50",
      badge: chatHistories.length > 0 ? chatHistories.length : null,
      active: true,
    },
    {
      id: "settings",
      icon: Settings,
      label: "Pengaturan",
      action: () => {
        console.log("Settings clicked");
        handleMenuNavigation("settings");
      },
      color: "text-gray-400 hover:text-gray-500 hover:bg-gray-50",
      active: false,
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Bantuan",
      action: () => {
        console.log("Help clicked");
        handleMenuNavigation("help");
      },
      color: "text-gray-600 hover:text-gray-700 hover:bg-gray-50",
      active: false,
    },
  ];

  const toggleChatOptions = (chatId) => {
    setShowChatOptions((prev) => ({
      ...prev,
      [chatId]: !prev[chatId],
    }));
  };

  const handleDeleteChat = (chatId, chatTitle, e) => {
    e.stopPropagation();
    setDeleteConfirm({ chatId, chatTitle });
    setShowChatOptions((prev) => ({
      ...prev,
      [chatId]: false,
    }));
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeleteChat(deleteConfirm.chatId);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteAllChats = () => {
    setDeleteAllConfirm(true);
  };

  const confirmDeleteAll = () => {
    try {
      if (onDeleteAllChats) {
        onDeleteAllChats();
      }
      setDeleteAllConfirm(false);
      console.log("All chat histories deleted successfully from Sidebar");
    } catch (error) {
      console.error("Error deleting all chats:", error);
      setDeleteAllConfirm(false);
    }
  };

  const cancelDeleteAll = () => {
    setDeleteAllConfirm(false);
  };

  const renderChatHistory = () => {
    if (chatHistories.length === 0) {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada riwayat chat</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {chatHistories.map((chat, index) => (
          <div
            key={chat.id}
            className={`
              relative group rounded-lg transition-all duration-200 cursor-pointer
              ${
                currentChatId === chat.id
                  ? "bg-blue-50 border border-blue-200 shadow-sm"
                  : "hover:bg-gray-50 border border-transparent"
              }
            `}
            onClick={() => onLoadChat(chat)}
          >
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                    {chat.title || "Chat Tanpa Judul"}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {chat.messageCount || 0}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(chat.lastUpdated || chat.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="relative ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChatOptions(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"
                  >
                    <MoreVertical className="w-3 h-3 text-gray-500" />
                  </button>

                  {showChatOptions[chat.id] && (
                    <>
                      <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-24 cursor-">
                        <button
                          onClick={(e) =>
                            handleDeleteChat(chat.id, chat.title, e)
                          }
                          className="cursor-pointer w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                      <div
                        className="fixed inset-0 z-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowChatOptions((prev) => ({
                            ...prev,
                            [chat.id]: false,
                          }));
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {currentChatId === chat.id && (
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Chat Aktif
                  </span>
                </div>
              )}
            </div>

            {index < chatHistories.length - 1 && (
              <div className="border-b border-gray-100 mx-3"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render different content panels like Gemini AI
  const renderContentPanel = () => {
    switch (activeMenu) {
      case "history":
        return (
          <div className="absolute inset-0 bg-white z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            {/* History Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveMenu("chat")}
                  className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Riwayat Percakapan
                  </h3>
                  <p className="text-xs text-gray-500">
                    {chatHistories.length} percakapan tersimpan
                  </p>
                </div>
              </div>
              {chatHistories.length > 0 && (
                <button
                  onClick={handleDeleteAllChats}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Hapus Semua Riwayat"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Semua</span>
                </button>
              )}
            </div>

            {/* History Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderChatHistory()}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="absolute inset-0 bg-white z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            {/* Settings Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-slate-50">
              <button
                onClick={() => setActiveMenu("chat")}
                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Pengaturan
                </h3>
                <p className="text-xs text-gray-500">Konfigurasi aplikasi</p>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium mb-1">Pengaturan</p>
                  <p className="text-xs">Fitur ini sedang dalam pengembangan</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="absolute inset-0 bg-white z-10 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            {/* Help Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50">
              <button
                onClick={() => setActiveMenu("chat")}
                className="p-1 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Bantuan</h3>
                <p className="text-xs text-gray-500">Panduan penggunaan</p>
              </div>
            </div>

            {/* Help Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium mb-1">Bantuan & Dukungan</p>
                  <p className="text-xs">
                    Panduan penggunaan akan segera tersedia
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-slate-400 bg-opacity-100 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-50 
        ${collapsed ? "w-0 lg:w-16" : "w-80"} 
        bg-white shadow-lg border-r border-gray-200 
        transform transition-all duration-300 ease-in-out
        ${!collapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col overflow-hidden
      `}
      >
        {/* Header - Always Visible */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-20">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSidebarToggle}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center justify-center"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>

            {!collapsed && (
              <div className="flex items-center space-x-3 flex-1 ml-2">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <img src="favicon.webp" alt="" className="rounded-xl" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold text-gray-800 truncate">
                    AI Chat Assistant
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Default View - Menu Items */}
          <div
            className={`h-full transition-transform duration-300 ease-out ${
              activeMenu !== "chat" &&
              activeMenu !== "new" &&
              activeMenu !== "clear"
                ? "transform -translate-x-full"
                : "transform translate-x-0"
            }`}
          >
            <div
              className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db #f3f4f6",
              }}
            >
              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isDisabled = item.disabled;
                  const isCurrentActive = activeMenu === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={!isDisabled ? item.action : undefined}
                      disabled={isDisabled}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2.5 
                        rounded-lg transition-all duration-200 
                        ${
                          !isDisabled
                            ? `${item.color} cursor-pointer ${
                                item.active ? "hover:shadow-sm" : ""
                              }`
                            : "text-gray-400 cursor-not-allowed"
                        }
                        ${collapsed ? "justify-center" : "justify-start"}
                        ${
                          isCurrentActive && item.active
                            ? "bg-blue-50 border border-blue-200 shadow-sm"
                            : ""
                        }
                        ${!item.active ? "opacity-60" : ""}
                      `}
                      title={collapsed ? item.label : ""}
                    >
                      <div className="relative">
                        <IconComponent className="w-5 h-5 transition-colors" />
                        {item.badge && !collapsed && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <span className="text-sm font-medium transition-colors">
                          {item.label}
                        </span>
                      )}
                      {!item.active && !collapsed && (
                        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                          SOON
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Context Memory Info - Always Visible */}
              {!collapsed && conversationCount > 0 && (
                <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center space-x-2 text-xs text-blue-700">
                    <Brain className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Memori Aktif</p>
                      <p>
                        AI mengingat {conversationCount} percakapan sebelumnya
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sliding Panels */}
          {renderContentPanel()}
        </div>

        {/* Footer - Always Visible */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 relative z-20">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">AI Chat Assistant</p>
              <p>Version 1.0.1</p>
              <p>
                © 2025 AI Chat Assistant | Maula Ibrahim Syahwi Powered by React
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete All Confirmation Modal */}
      {deleteAllConfirm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.15s ease-out" }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-gray-100"
            style={{ animation: "scaleIn 0.2s ease-out" }}
          >
            {/* Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus semua riwayat?
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-1">
                {chatHistories.length} percakapan akan dihapus permanent
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Tindakan ini tidak dapat dibatalkan
              </p>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteAll}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-150 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteAll}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Chat Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.15s ease-out" }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-gray-100"
            style={{ animation: "scaleIn 0.2s ease-out" }}
          >
            {/* Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-orange-500" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hapus percakapan?
              </h3>

              {/* Description */}
              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-left border">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    "{deleteConfirm.chatTitle || "Chat Tanpa Judul"}"
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-6">
                Tindakan ini tidak dapat dibatalkan
              </p>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-150 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-150 cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for simple animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Mobile Toggle Button */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-30 lg:hidden p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
        >
          <Menu className="w-5 h-5 text-gray-600" />
          {(conversationCount > 0 || chatHistories.length > 0) && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {chatHistories.length || conversationCount}
            </span>
          )}
        </button>
      )}
    </>
  );
};

export default Sidebar;
