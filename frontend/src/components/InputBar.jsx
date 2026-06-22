function InputBar({
  message,
  setMessage,
  sendMessage,
  loading,
}) {
  return (
    <div className="input-bar">
      <button className="attach-btn">
        +
      </button>

      <input
        value={message}
        placeholder="Message SindhuGPT..."
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !loading
          ) {
            sendMessage();
          }
        }}
      />

      <button
        className="send-btn"
        onClick={sendMessage}
        disabled={loading}
      >
        ➤
      </button>
    </div>
  );
}

export default InputBar;