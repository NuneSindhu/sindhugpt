import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";

import "./App.css";

function App() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChatId) {
      loadMessages(currentChatId);
    }
  }, [currentChatId]);

  async function loadChats() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chats"
      );

      const data = await response.json();

      if (data.length > 0) {
        setChats(
          data.map((chat) => ({
            ...chat,
            messages: [],
          }))
        );

        setCurrentChatId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  }

  async function loadMessages(chatId) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/messages/${chatId}`
      );

      const data = await response.json();

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: data,
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  function createNewChat() {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  }

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    const activeChatId = currentChatId;

    setMessage("");
    setLoading(true);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title:
                chat.title === "New Chat"
                  ? userMessage.slice(0, 20)
                  : chat.title,
              messages: [
                ...(chat.messages || []),
                {
                  role: "user",
                  content: userMessage,
                },
              ],
            }
          : chat
      )
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: activeChatId,
            message: userMessage,
          }),
        }
      );

      const data = await response.json();

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...(chat.messages || []),
                  {
                    role: "assistant",
                    content: data.response,
                  },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);

      loadChats();
      loadMessages(activeChatId);
    }
  }

  return (
    <div className="layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={setCurrentChatId}
        createNewChat={createNewChat}
      />

      <div className="main-content">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <ChatWindow
          currentChat={currentChat}
          loading={loading}
        />

        <InputBar
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;