import React, { useState, useEffect } from "react";

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 40,
  initialDelay = 0,
  loop = true,
  className = "",
  showCursor = true,
  cursorCharacter = "_",
  cursorClassName = "animate-pulse",
  cursorBlinkDuration = 1,
  onComplete = () => {},
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursorState, setShowCursorState] = useState(showCursor);

  useEffect(() => {
    let timeoutId;

    const startTyping = () => {
      if (initialDelay > 0) {
        timeoutId = setTimeout(() => {
          setIsTyping(true);
        }, initialDelay);
      } else {
        setIsTyping(true);
      }
    };

    startTyping();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialDelay]);

  useEffect(() => {
    if (!isTyping) return;

    let timeoutId;

    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Typing selesai
        onComplete();
        if (loop) {
          // Reset untuk loop
          setTimeout(() => {
            setDisplayText("");
            setCurrentIndex(0);
          }, 2000);
        } else {
          // Sembunyikan cursor setelah selesai jika tidak loop
          if (showCursor) {
            setTimeout(() => {
              setShowCursorState(false);
            }, 2000);
          }
        }
      }
    };

    timeoutId = setTimeout(typeNextCharacter, typingSpeed);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex, text, typingSpeed, isTyping, loop, onComplete, showCursor]);

  const cursorStyle = {
    animationDuration: `${cursorBlinkDuration}s`,
  };

  return (
    <Component className={className}>
      <span style={{ display: "inline" }}>{displayText}</span>
      {showCursorState && (
        <span className={cursorClassName} style={cursorStyle}>
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
};

export default TextType;
