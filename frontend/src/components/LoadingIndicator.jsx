import React from "react";
import { Bot, Loader } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="flex items-start space-x-2 sm:space-x-3">
      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
      </div>
      <div className="flex-1 max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg">
        <div className="inline-block p-2 sm:p-3 bg-gray-100 rounded-2xl">
          <div className="flex items-center space-x-2">
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-500" />
            <span className="text-xs sm:text-sm text-gray-600">
              Menunggu jawaban...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
