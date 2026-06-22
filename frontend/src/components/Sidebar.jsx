function Sidebar({
  sidebarOpen,
  chats,
  currentChatId,
  setCurrentChatId,
  createNewChat,
}) {
  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : "closed"
      }`}
    >
      <button
        className="new-chat-btn"
        onClick={createNewChat}
      >
        + New Chat
      </button>

      <input
        className="search-input"
        placeholder="Search chats..."
      />

      <div className="recent-chats">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${
              currentChatId === chat.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentChatId(chat.id)
            }
          >
            {chat.title}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;