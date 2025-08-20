import React from "react";
import TextType from "./TextType/TextType";

const WelcomeMessage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <TextType
          text="Hallo, Selamat Datang!"
          as="h1"
          typingSpeed={150}
          initialDelay={500}
          loop={false}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          showCursor={true}
          cursorCharacter="_"
          cursorClassName="text-blue-600 animate-pulse"
          cursorBlinkDuration={0.5}
        />
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4 mt-4">
          Mulai percakapan dengan mengetik pesan Anda di bawah
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
