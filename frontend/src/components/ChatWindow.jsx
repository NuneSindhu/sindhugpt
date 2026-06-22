import ReactMarkdown from "react-markdown";

export default function ChatWindow({
  currentChat,
  loading,
}) {
  return (
    <div className="chat-window">
      {currentChat?.messages.map(
        (msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
          >
            {msg.role === "assistant" ? (
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        )
      )}

      {loading && (
        <div className="message assistant">
          Thinking...
        </div>
      )}
    </div>
  );
}