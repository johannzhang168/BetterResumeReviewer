"use client"
import React, { useState, useRef, useEffect } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  attachments?: File[]
}

const Chat: React.FC = () => {

  //this will be under chat/:chatId
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() && files.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      attachments: files.length > 0 ? [...files] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setFiles([])
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I received your message. How else can I assist you?I received your message. How else can I assist you?I received your message. How else can I assist you?I received your message. How else can I assist you?I received your message. How else can I assist you?I received your message. How else can I assist you?",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col h-[85vh] bg-background mt-20">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-5">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "user" ? 
              <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
                <div className="whitespace-pre-wrap">{message.content}</div>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Attachments:</p>
                    <ul className="list-disc pl-5">
                      {message.attachments.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
             : 

             <div className="whitespace-pre-wrap">{message.content}</div>
             
            }
            
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-lg p-3">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File preview area */}
      {/* {files.length > 0 && (
        <div className="px-4 py-2 bg-muted/50 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Selected files:</span>
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="text-xs bg-muted px-2 py-1 rounded-md">
                  {file.name}
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="ml-auto text-xs">
              Clear
            </Button>
          </div>
        </div>
      )} */}

      <div className={`border-t p-4 fixed w-full bottom-0 left-0 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={triggerFileInput}
            className="shrink-0"
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />

          <Button
            type="submit"
            size="icon"
            className="shrink-0"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  )
}

export default Chat



