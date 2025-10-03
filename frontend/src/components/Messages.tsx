import React, { useState, useEffect } from "react";
import "../styles/Messages.css";
import { useNavigate } from "react-router-dom";

type Chat = {
  id: number;
  username: string;
  lastMessage: string;
  color: string;
};

type Message = {
  id: number;
  sender: string;
  text: string;
};

const Messages: React.FC = () => {
  const [chats] = useState<Chat[]>([
    { id: 1, username: "user.name", lastMessage: "Continuar conversación", color: "red" },
    { id: 2, username: "user.name", lastMessage: "Continuar conversación", color: "blue" },
    { id: 3, username: "user.name", lastMessage: "Continuar conversación", color: "green" },
    { id: 4, username: "user.name", lastMessage: "Continuar conversación", color: "orange" },
  ]);

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedChat) {
      setMessages([
        { id: 1, sender: "user.name", text: "Hola, ¿cómo estás?" },
        { id: 2, sender: "yo", text: "Todo bien, ¿y tú?" },
      ]);
    }
  }, [selectedChat]);

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: Date.now(), sender: "yo", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="messages-container">
      {/* Lista de chats */}
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item${selectedChat?.id === chat.id ? " active" : ""}`}
            style={{ borderLeft: `5px solid ${chat.color}` }}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="chat-username">@{chat.username}</div>
            <div className="chat-last">{chat.lastMessage}</div>
          </div>
        ))}
      </div>

      {/* Ventana de mensajes */}
      <div className="chat-window">
        {selectedChat ? (
          <>
            <div className="chat-header">@{selectedChat.username}</div>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble ${msg.sender === "yo" ? "me" : "other"}`}
                  style={{ userSelect: "none", cursor: "default" }}
                >
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            <div className="icon-sidebar-overlay">
              <button
                className="icon-image-btn"
                onClick={() => navigate("/principal")}
              >
                <img src={require("../assets/img/home.jpg")} alt="Ir a principal" />
              </button>
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSend}>Enviar</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">Selecciona un chat para continuar</div>
        )}
      </div>

      {/* Contenedor de iconos como la imagen */}
      <div className="icon-sidebar-container">
        <div className="icon-bar">
          <i className="fas fa-sign-out-alt"></i>
          <i className="fas fa-bell"></i>
          <i className="fas fa-comments"></i>
          <i className="fas fa-cog"></i>
        </div>
        <div className="icon-bar">
          <i className="fas fa-home"></i>
          <i className="fas fa-user"></i>
          <i className="fas fa-search"></i>
          <i className="fas fa-th"></i>
          <i className="fas fa-image"></i>
        </div>
      </div>
    </div>
  );
};

export default Messages;