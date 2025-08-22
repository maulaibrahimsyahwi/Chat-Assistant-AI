// Message.jsx

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  User,
  Edit3,
  Check,
  X,
  RotateCcw,
  Table,
  Copy,
} from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const Message = ({ message, onEditMessage, isLastUserMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";
  const canEdit = isUser && isLastUserMessage;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      adjustTextareaHeight();
    }
  }, [isEditing]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(message.text);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== message.text) {
      onEditMessage(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Function untuk copy pesan ke clipboard
  const handleCopyMessage = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset setelah 2 detik
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback untuk browser yang tidak support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = message.text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const renderCellWithMath = (cellContent) => {
    const mathPatterns = [
      /(\$\$[\s\S]*?\$\$)/g,
      /(\\\[[\s\S]*?\\\])/g,
      /(\$[^$\n]+?\$)/g,
      /(\\\([^)]*?\\\))/g,
      /(\\displaystyle[^()]*?(?:\([^)]*\))?[^.]*?\.)/g,
      /(\\frac\{[^}]*\}\{[^}]*\})/g,
      /(\\sqrt\{[^}]*\})/g,
      /(\\[a-zA-Z]+\{[^}]*\})/g,
    ];

    let processedContent = cellContent;
    const mathParts = [];

    mathPatterns.forEach((pattern) => {
      const matches = [...cellContent.matchAll(pattern)];
      matches.forEach((match) => {
        const placeholder = `__MATH_${mathParts.length}__`;
        mathParts.push({
          original: match[0],
          placeholder: placeholder,
          isBlock:
            match[0].startsWith("$") ||
            match[0].startsWith("\\[") ||
            match[0].includes("\\displaystyle"),
        });
        processedContent = processedContent.replace(match[0], placeholder);
      });
    });

    const boldParts = [];
    const boldPattern = /(\*\*[^*]+\*\*)/g;
    const boldMatches = [...processedContent.matchAll(boldPattern)];
    boldMatches.forEach((match) => {
      const placeholder = `__BOLD_${boldParts.length}__`;
      boldParts.push({
        original: match[0],
        placeholder: placeholder,
        content: match[0].slice(2, -2),
      });
      processedContent = processedContent.replace(match[0], placeholder);
    });

    if (mathParts.length === 0 && boldParts.length === 0) {
      return <span>{cellContent}</span>;
    }

    const parts = processedContent.split(/(__MATH_\d+__|__BOLD_\d+__)/g);

    return (
      <span>
        {parts.map((part, idx) => {
          const mathMatch = part.match(/^__MATH_(\d+)__$/);
          if (mathMatch) {
            const mathIndex = parseInt(mathMatch[1]);
            const mathObj = mathParts[mathIndex];
            if (mathObj) {
              let mathExpression = mathObj.original;

              if (
                mathExpression.startsWith("$") &&
                mathExpression.endsWith("$")
              ) {
                mathExpression = mathExpression.slice(2, -2);
              } else if (
                mathExpression.startsWith("\\[") &&
                mathExpression.endsWith("\\]")
              ) {
                mathExpression = mathExpression.slice(2, -2);
              } else if (
                mathExpression.startsWith("$") &&
                mathExpression.endsWith("$")
              ) {
                mathExpression = mathExpression.slice(1, -1);
              } else if (
                mathExpression.startsWith("\\(") &&
                mathExpression.endsWith("\\)")
              ) {
                mathExpression = mathExpression.slice(2, -2);
              }

              mathExpression = mathExpression
                .replace(/\\displaystyle\s*/g, "")
                .replace(/\{,\}/g, ",")
                .replace(/\s+/g, " ")
                .trim();

              try {
                return mathObj.isBlock && !mathObj.original.startsWith("$") ? (
                  <BlockMath key={idx}>{mathExpression}</BlockMath>
                ) : (
                  <InlineMath key={idx}>{mathExpression}</InlineMath>
                );
              } catch (error) {
                return (
                  <code
                    key={idx}
                    className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs"
                  >
                    {mathObj.original}
                  </code>
                );
              }
            }
          }

          const boldMatch = part.match(/^__BOLD_(\d+)__$/);
          if (boldMatch) {
            const boldIndex = parseInt(boldMatch[1]);
            const boldObj = boldParts[boldIndex];
            if (boldObj) {
              return (
                <strong key={idx} className="font-bold text-gray-900">
                  {boldObj.content}
                </strong>
              );
            }
          }

          return part || null;
        })}
      </span>
    );
  };

  const parseTableData = (text) => {
    // =========================================================================
    // DITAMBAHKAN: Pengecekan untuk mencegah error jika 'text' bukan string
    // =========================================================================
    if (typeof text !== "string") {
      return { hasTable: false };
    }

    const lines = text.split("\n").filter((line) => line.trim());
    const tablePattern = /^\|.*\|$/;
    let tableFound = false;
    let tableLines = [];
    let beforeTable = "";
    let afterTable = "";
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (tablePattern.test(line)) {
        if (!tableFound) {
          beforeTable = lines.slice(0, i).join("\n");
          tableFound = true;
          currentIndex = i;
        }
        tableLines.push(line);
      } else if (tableFound && tableLines.length > 0) {
        afterTable = lines.slice(i).join("\n");
        break;
      }
    }

    if (tableLines.length >= 2) {
      const headers = tableLines[0]
        .split("|")
        .map((h) => h.trim())
        .filter((h) => h);
      const separatorRow = tableLines[1];
      const dataRows = tableLines.slice(2).map((row) =>
        row
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell)
      );

      return {
        hasTable: true,
        beforeTable,
        afterTable,
        headers,
        dataRows,
      };
    }

    return { hasTable: false };
  };

  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="mb-1 sm:mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-1 sm:mb-2 space-y-0.5 sm:space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-1 sm:mb-2 space-y-0.5 sm:space-y-1">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="text-xs sm:text-sm">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-xs font-mono break-all">
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-gray-100 text-gray-800 p-1.5 sm:p-2 rounded text-xs font-mono overflow-x-auto">
          {children}
        </code>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 sm:border-l-4 border-gray-300 pl-2 sm:pl-3 italic text-gray-700 mb-1 sm:mb-2">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline break-words"
      >
        {children}
      </a>
    ),
  };

  const TableComponent = ({ headers, dataRows }) => (
    <div className="my-3 overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 p-2 bg-blue-50 border-b">
        <Table className="w-4 h-4 text-blue-600" />
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-3 py-2 text-left font-medium text-gray-700 border-b"
              >
                {renderCellWithMath(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-3 py-2 border-b border-gray-100"
                >
                  {renderCellWithMath(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEnhancedContent = (text) => {
    const tableData = parseTableData(text);

    const renderTextWithMath = (content) => {
      const mathPatterns = [
        /(\$\$[\s\S]*?\$\$)/g,
        /(\\\[[\s\S]*?\\\])/g,
        /(\$[^$\n]+?\$)/g,
        /(\\\([^)]*?\\\))/g,
        /(\\displaystyle[^()]*?(?:\([^)]*\))?[^.]*?\.)/g,
        /(\\frac\{[^}]*\}\{[^}]*\}[^.]*?\.)/g,
        /(\\sqrt\{[^}]*\})/g,
        /(\\[a-zA-Z]+\{[^}]*\})/g,
      ];

      let processedContent = content;
      const mathParts = [];

      mathPatterns.forEach((pattern) => {
        const matches = [...content.matchAll(pattern)];
        matches.forEach((match) => {
          const placeholder = `__MATH_${mathParts.length}__`;
          mathParts.push({
            original: match[0],
            placeholder: placeholder,
            isBlock:
              match[0].startsWith("$$") ||
              match[0].startsWith("\\[") ||
              match[0].includes("\\displaystyle"),
          });
          processedContent = processedContent.replace(match[0], placeholder);
        });
      });

      const parts = processedContent.split(/(__MATH_\d+__)/g);

      return parts.map((part, idx) => {
        const mathMatch = part.match(/^__MATH_(\d+)__$/);
        if (mathMatch) {
          const mathIndex = parseInt(mathMatch[1]);
          const mathObj = mathParts[mathIndex];
          if (mathObj) {
            let mathExpression = mathObj.original;

            if (
              mathExpression.startsWith("$$") &&
              mathExpression.endsWith("$$")
            ) {
              mathExpression = mathExpression.slice(2, -2);
            } else if (
              mathExpression.startsWith("\\[") &&
              mathExpression.endsWith("\\]")
            ) {
              mathExpression = mathExpression.slice(2, -2);
            } else if (
              mathExpression.startsWith("$") &&
              mathExpression.endsWith("$")
            ) {
              mathExpression = mathExpression.slice(1, -1);
            } else if (
              mathExpression.startsWith("\\(") &&
              mathExpression.endsWith("\\)")
            ) {
              mathExpression = mathExpression.slice(2, -2);
            }

            mathExpression = mathExpression
              .replace(/\\displaystyle\s*/g, "")
              .replace(/\{,\}/g, ",")
              .replace(/\s+/g, " ")
              .trim();

            try {
              return mathObj.isBlock ? (
                <BlockMath key={idx}>{mathExpression}</BlockMath>
              ) : (
                <InlineMath key={idx}>{mathExpression}</InlineMath>
              );
            } catch (error) {
              return (
                <code
                  key={idx}
                  className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs"
                >
                  {mathObj.original}
                </code>
              );
            }
          }
        }

        return part ? (
          <ReactMarkdown key={idx} components={markdownComponents}>
            {part}
          </ReactMarkdown>
        ) : null;
      });
    };

    return (
      <div>
        {tableData.hasTable && tableData.beforeTable && (
          <div className="mb-2">
            {renderTextWithMath(tableData.beforeTable)}
          </div>
        )}

        {tableData.hasTable && (
          <TableComponent
            headers={tableData.headers}
            dataRows={tableData.dataRows}
          />
        )}

        {tableData.hasTable && tableData.afterTable && (
          <div className="mt-2">{renderTextWithMath(tableData.afterTable)}</div>
        )}

        {!tableData.hasTable && renderTextWithMath(text)}
      </div>
    );
  };

  const formatTime = (timestamp) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Jika sedang editing, buat container penuh untuk textarea
  if (isEditing) {
    return (
      <div className="w-full px-2 sm:px-4">
        <div className="w-full max-w-none space-y-2">
          <div className="w-full rounded-2xl border border-blue-200 bg-blue-50 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyPress}
              className="w-full p-3 sm:p-4 bg-transparent border-none resize-none focus:outline-none text-sm sm:text-base"
              placeholder="Edit pesan Anda..."
              style={{
                minHeight: "60px",
                maxHeight: "300px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleSaveEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              disabled={!editText.trim()}
            >
              <Check className="w-4 h-4" />
              <span>Simpan</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Batal</span>
            </button>
          </div>

          <p className="text-xs text-gray-500 px-1 text-center">
            Tekan Enter untuk simpan, Esc untuk batal
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex items-start space-x-2 sm:space-x-3 group ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        <div
          className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
            message.sender === "ai"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600"
              : "bg-gradient-to-r from-gray-500 to-gray-600"
          }`}
        >
          {message.sender === "ai" ? (
            <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          ) : (
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          )}
        </div>

        <div
          className={`flex-1 min-w-0 max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
            isUser ? "text-right pr-2 pt-1" : ""
          }`}
        >
          <div className="relative">
            <div>
              {/* Container dengan flex untuk bubble dan action buttons */}
              <div
                className={`flex items-start ${
                  isUser ? "flex-row-reverse" : ""
                }`}
              >
                {/* Message bubble */}
                <div
                  className={`inline-block p-2 sm:p-3 rounded-2xl max-w-full ${
                    message.sender === "ai"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  } ${
                    message.isRegenerated
                      ? "border-2 border-yellow-400 shadow-lg"
                      : ""
                  }`}
                >
                  {isAI ? (
                    <div className="text-xs sm:text-sm prose prose-sm max-w-none break-words">
                      {renderEnhancedContent(message.text)}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  )}
                </div>

                {/* Action buttons di sebelah bubble */}
                <div
                  className={`flex flex-col items-center justify-start space-y-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isUser ? "mr-2" : "ml-2"
                  } mt-1`}
                >
                  {/* Tombol Copy */}
                  <button
                    onClick={handleCopyMessage}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    title={copied ? "Disalin!" : "Salin pesan"}
                  >
                    <Copy
                      className={`w-3 h-3 cursor-pointer ${
                        copied ? "text-green-500" : ""
                      }`}
                    />
                  </button>

                  {/* Tombol Edit (hanya untuk user message terakhir) */}
                  {canEdit && !isEditing && (
                    <button
                      onClick={handleStartEdit}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit pesan"
                    >
                      <Edit3 className="w-3 h-3 cursor-pointer" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-1 px-1 sm:px-2">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Indikator "Pertanyaan diperbarui" - sebagai elemen terpisah yang benar-benar di tengah */}
      {message.isRegenerated && (
        <div className="w-full flex justify-center mt-1 mb-2">
          <div className="flex items-center text-xs text-amber-600 bg-amber-50 rounded-full px-3 py-1 border border-amber-200 shadow-sm">
            <RotateCcw className="w-3 h-3 mr-1" />
            <span>Pertanyaan diperbarui</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
