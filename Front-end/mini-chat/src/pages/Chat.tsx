import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styled from "styled-components";

const socket = io("http://localhost:5000"); // Change this to your backend service

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const Message = styled.div<{ isOwnMessage: boolean }>`
  background-color: ${({ isOwnMessage }) => (isOwnMessage ? "#4CAF50" : "#ddd")};
  color: ${({ isOwnMessage }) => (isOwnMessage ? "white" : "black")};
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
  max-width: 70%;
  align-self: ${({ isOwnMessage }) => (isOwnMessage ? "flex-end" : "flex-start")};
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isOwnMessage: boolean }[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, isOwnMessage: false }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send_message", message);
    setMessages((prev) => [...prev, { text: message, isOwnMessage: true }]);
    setMessage("");
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <Message key={index} isOwnMessage={msg.isOwnMessage}>
            {msg.text}
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
