// src/components/TextType/TextType.jsx
import { useState, useEffect } from "react";
import { TYPING_EFFECT } from "../../constants";

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = TYPING_EFFECT.DEFAULT_SPEED,
  initialDelay = TYPING_EFFECT.INITIAL_DELAY,
  loop = true,
  className = "",
  showCursor = true,
  cursorCharacter = "_",
  cursorClassName = "animate-pulse",
  cursorBlinkDuration = TYPING_EFFECT.CURSOR_BLINK_DURATION,
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
        timeoutId = setTimeout(() => setIsTyping(true), initialDelay);
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
        onComplete();
        if (loop) {
          setTimeout(() => {
            setDisplayText("");
            setCurrentIndex(0);
          }, TYPING_EFFECT.LOOP_DELAY);
        } else if (showCursor) {
          setTimeout(() => {
            setShowCursorState(false);
          }, TYPING_EFFECT.LOOP_DELAY);
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
