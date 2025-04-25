"use client"
import React, { useState, useRef, useEffect, useCallback } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useUser } from "@/context/UseUser"
import toast from "react-hot-toast"
import "katex/dist/katex.min.css";
import Message from "@/components/chat/Message"
import NotFound from "@/components/Empty"
import LoadingSpinner from "@/components/Loading"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  file_url?: string
  file_name?: string
}

interface Chat {
  id: string,
  lastUpdated?: string,
  max_tokens: number,
  messages: Message[],
  model: string,
  name: string,
  resumes: string[],
  temperature: number,
  thumbnail: string,
  total_tokens_used: number,
  userid: string
}

const Chat: React.FC= () => {
  //this will be under chat/:chatId
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const location = useLocation();
  const [initialData, setInitialData] = useState(() => location.state?.data || null);
  const hasSentInitial = useRef<boolean>(false);
  const {currentUser, setCurrentUser} = useUser();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const shouldAutoScroll = useRef(true);
  const navigate = useNavigate();
  // const [shouldCheck, setShouldCheck] = useState(false);
  // const [shouldCheck, setShouldCheck] = useState(false);


  // const navigate = useNavigate();
  // useEffect(() => {
    
  // },) 

  const handleSendMessage = useCallback(async (e?: React.FormEvent, fileOverride?: File, jobDescription?: string) => {
    if (e) e.preventDefault();
    if(!chatId || !currentUser){
      return;
    }
    if (!input.trim() && !jobDescription && !file && !fileOverride || !currentUser){
      return;
    } 
    // console.log("sending message")
    setIsLoading(true);
  
    const body = new FormData();
    
    body.append("userId", currentUser.id);
    if (file) body.append("resume", file);
    else if (fileOverride) body.append("resume", fileOverride)

    if (input) body.append("query", input.trim());
    else if (jobDescription) body.append("query", jobDescription)
  
    const userMessage: Message = {
      id: "",
      content: input.trim(),
      role: "user",
      timestamp: "",
    };
  
    const resumeMessage: Message = {
      id: "",
      content: "",
      role: "user",
      timestamp: "",
      file_url: "",
      file_name: file?.name,
    };
  
    const optimisticMessages: Message[] = [];
    if (file) optimisticMessages.push(resumeMessage);
    if (input) optimisticMessages.push(userMessage);
  

    setMessages(prev => [...prev, ...optimisticMessages]);
    // console.log("here")
    setInput("");
    setFile(undefined);
  
    const response = await fetch(`${BASE_URL}/chat/ask/${chatId}`, {
      method: "POST",
      body: body,
    });
  
    if (!response.ok || !response.body) {
      toast.error("Failed to send message");
      setIsLoading(false);
      return;
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
  
    let buffer = "";
    let fullContent = "";
    let isFirstChunk = true;
    let assistantIndex: number | undefined = undefined;
  
    let currentMessages: Message[] = [...optimisticMessages];
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // keep incomplete line
  
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
  
        const payloadRaw = line.slice(6).trim();
        if (payloadRaw === "[DONE]") break;
  
        try {
          const payload = JSON.parse(payloadRaw);
          if (isFirstChunk) {
            isFirstChunk = false;
  
            const updatedMessages: Message[] = [];
  
            if (payload.resumeMsg) {
              updatedMessages.push({
                id: payload.resumeMsg.id,
                content: payload.resumeMsg.content,
                role: "user",
                timestamp: payload.resumeMsg.timestamp,
                file_url: payload.resumeMsg.file_url,
                file_name: payload.resumeMsg.file_name,
              });
            }
  
            if (payload.userMsg) {
              updatedMessages.push({
                id: payload.userMsg.id,
                content: payload.userMsg.content,
                role: "user",
                timestamp: payload.userMsg.timestamp,
              });
            }
            currentMessages = currentMessages.slice(0, -updatedMessages.length);
            currentMessages = [...currentMessages, ...updatedMessages];
  
            assistantIndex = currentMessages.length;
            currentMessages.push({
              id: "",
              content: "",
              role: "assistant",
              timestamp: new Date().toISOString(),
            });
  
            setMessages([...messages, ...currentMessages]);
          }
          else if (payload.token) {
            fullContent += payload.token;
  
            if (assistantIndex !== undefined) {
              currentMessages[assistantIndex] = {
                ...currentMessages[assistantIndex],
                content: fullContent,
              };
  
              setMessages([...messages, ...currentMessages]);
            }
          }
        } catch (err) {
          toast.error("Stream parsing error");
          console.error("Stream parsing error:", err, line);
        }
      }
    }
    setIsLoading(false);
  }, [BASE_URL, chatId, currentUser, file, input, messages]);

  
  
  function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64); 
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  useEffect(() => {
    if(!currentUser){
      return;
    }
    const sendInitialMessage = async () => {
      if (initialData && !hasSentInitial.current) {
        console.log(initialData)
        hasSentInitial.current = true;
        setCurrentUser(initialData.user)
        const byteArray = base64ToUint8Array(initialData.resume);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const resume = new File([blob], initialData.resume_name, { type: "application/pdf" });
        const jobDescription = initialData.job_description;
        // console.log("sending initial message")
        await handleSendMessage(undefined, resume, jobDescription);
        setInitialData(null);
        navigate(location.pathname, { replace: true, state: null });
      }
    };
    const fetchData = async () => {
      setLoadingData(true);
      if(!chatId || !currentUser){
        setLoadingData(false)
        setIsDisabled(true)
        return;
      }
      
      const response = await fetch(`${BASE_URL}/chat/get/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      if(data.status_code === 404){
        setIsAuthorized(false); 
        return;
      }
      if (data.status !== 200) {
        toast.error("Error fetching chat data");
        throw new Error(response.statusText);
      }

      if(data.chat.userid !== currentUser.id){
        console.log(currentUser.chats)
        setLoadingData(false)
        setIsAuthorized(false)
        setIsDisabled(true);
        return;
      }
      setChat(data.chat)
      setMessages(data.chat.messages);
      setLoadingData(false)
    };
    fetchData();
    sendInitialMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser
  ]);

  useEffect(() => {
    if (chat) {
      setIsAuthorized(chat.userid === currentUser?.id);
    }
  }, [chat, currentUser]);
  
  useEffect(() => {
    if (shouldAutoScroll.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages]);

 
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShouldCheck(true);
  //   }, 1000); // Delay of 1000ms = 1 second

  //   return () => clearTimeout(timer); // Cleanup on unmount
  // }, []);

  // if (!shouldCheck) {
  //   return null; 
  // }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(Array.from(e.target.files)[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  

  if (isAuthorized === false) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <NotFound />
      </div>
    );
  }

  if (loadingData) {
    return(
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
    
  }

 

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 p-4 space-y-4 pb-24 mt-20">
      {messages.map((message, index) => {
        if (!message || typeof message !== "object" || !("role" in message)) {
          return null;
        }
        return (
          <Message message={message} index={index} key={message.id}/>
          );
        })}
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

      <div className="fixed bottom-0 left-0 w-full z-10 bg-background border-t">
      {file && (
        <div className="px-4 py-2 bg-muted/50 border-t ">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Selected files:</span>
            <div className="flex flex-wrap gap-2"> 
              {file.name}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setFile(undefined)} className="ml-auto text-xs">
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className={`p-4 ${isLoading && isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={triggerFileInput}
            className="shrink-0"
            disabled={isLoading && isDisabled}
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
    </div>
  )
}

export default Chat



