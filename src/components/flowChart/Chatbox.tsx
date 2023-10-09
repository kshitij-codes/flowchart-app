import React, { useState } from "react";
import chatData from "./responses.json";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string | number;
  content: string;
  isBot: boolean;
  nextNode?: number;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = () => {
    if (userInput.trim() !== "") {
      const lastBotMessage = messages.find((message) => message.isBot);
      const nextNode = lastBotMessage ? lastBotMessage.nextNode : 1;

      const userMessage: Message = {
        id: uuidv4(), // Use UUID for id
        content: userInput,
        isBot: false,
        nextNode: nextNode,
      };

      setMessages([...messages, userMessage]);
      handleBotResponse(userMessage);
      setUserInput("");
    }
  };

  console.log({ messages });

  const handleBotResponse = (userInput: any) => {
    const lastUserMessage = messages[messages.length - 1];
    const nextNode = lastUserMessage ? lastUserMessage.nextNode : 1;

    const botMessage = chatData.messages.find(
      (message) => message.id === nextNode
    );
    if (botMessage) {
      const botResponse: Message = {
        id: botMessage.id,
        content: botMessage.content,
        isBot: true,
        nextNode: botMessage.nextNode, // Include nextNode property for the bot response
      };
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 800);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 border rounded shadow-lg bg-white">
      <div className="mb-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.isBot
                ? "text-blue-600 text-left"
                : "text-green-600 text-right"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
