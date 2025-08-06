"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface Message {
  id: number
  text: string
  sender: "user" | "other"
  timestamp: Date
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey there! How's it going?",
      sender: "other",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      text: "Hi! I'm doing great, thanks for asking. How about you?",
      sender: "user",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: 3,
      text: "I'm doing well too! Just working on some new projects. What have you been up to lately?",
      sender: "other",
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: 4,
      text: "That sounds exciting! I've been learning some new technologies and building some cool apps.",
      sender: "user",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: 5,
      text: "Nice! What kind of technologies are you exploring?",
      sender: "other",
      timestamp: new Date(Date.now() - 60000),
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (inputValue.trim() === "" || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from API')
      }

      const data = await response.json()

      if (data.error) {
        const errorMessage = data.code === 'QUOTA_EXCEEDED' 
          ? "API 使用額度已用完。請檢查你的 OpenAI 帳號或設定付款方式。"
          : data.details || data.error;
        throw new Error(errorMessage)
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        text: data.response,
        sender: "other",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "抱歉，我現在無法回應。請稍後再試。",
        sender: "other",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Chat</h1>
        <p className="text-blue-100 text-sm">Online</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={inputValue.trim() === "" || isLoading}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "..." : "➤"}
          </button>
        </form>
      </div>
    </div>
  )
}
