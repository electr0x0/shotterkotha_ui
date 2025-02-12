"use client"
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLoader2 } from "@tabler/icons-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";

export default function AIChatMessage() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axiosInstance.get('/chat/history/');
      const formattedMessages = response.data.map(msg => ({
        id: msg.id,
        text: msg.response,
        thinking: msg.thinking_process,
        sender: "ai",
        timestamp: msg.created_at,
        prompt: msg.prompt
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error("Failed to load chat history");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/chat/', {
        prompt: inputMessage
      });

      const aiResponse = {
        id: response.data.chat_id,
        text: response.data.response,
        thinking: response.data.thinking,
        sender: "ai",
        timestamp: response.data.created_at
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
      // Remove the user message if AI response fails
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-background border rounded-lg shadow-lg z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h3 className="font-semibold">AI Assistant</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.sender === "ai" && message.thinking && (
                    <div className="text-xs text-muted-foreground mb-2 italic">
                      {message.thinking}
                    </div>
                  )}
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 