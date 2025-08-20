const Header = ({ onToggleSidebar }) => {
  return (
    <div className="bg-white shadow-sm border-b flex-shrink-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                AI Chat Assistant
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Powered by Groq AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
