import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";


interface MessageType {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  file_url?: string
  file_name?: string
}

interface MessageProps {
  message: MessageType;
  index?: number
}



const Message: React.FC<MessageProps> = ({message, index}) => {
  console.log(message)
  const timestamp = new Date(message.timestamp);
  const now = new Date();

  const isToday =
    timestamp.getDate() === now.getDate() &&
    timestamp.getMonth() === now.getMonth() &&
    timestamp.getFullYear() === now.getFullYear();

  const formatted = isToday
    ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : timestamp.toLocaleDateString();
  return(
    <div key={message.id || index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      {message.role === "user" ? (
        <div className="max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground">
          {!message.file_url ? <div className="whitespace-pre-wrap">{message.content}</div> :
            null
          }
          {message.file_url && (
            <div className="mt-2 text-sm">
              <p className="font-medium">{message.file_name}</p>
            </div>
          )}
          <div className="text-xs opacity-70 mt-1">
            {formatted}
          </div>
        </div>
      ) : (
        // Markdown display for assistant
        <div className="text-muted-foreground w-full">
          <div className="prose prose-sm max-w-none overflow-y-auto text-muted-foreground whitespace-pre-wrap">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >{message.content}</ReactMarkdown>
          </div>
          <div className="text-xs opacity-70 mt-1">
            {formatted}
          </div>
        </div>
      )}
    </div>
  )
}

export default Message