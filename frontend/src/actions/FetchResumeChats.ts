// import { useResume } from "@/context/UseResume";
import toast from "react-hot-toast";


const BASE_URL = import.meta.env.VITE_API_BASE_URL
interface ResumeChatData {
        id: string;
        title: string;
        dateCreated: string;
        lastUpdated: string;
        thumbnail: string;
      }
export const fetchResumeChats = async (userId: string, setResumeChats: (chats: ResumeChatData []) => void , query?: string, ) => {
        const formData = new FormData();
        if(query) formData.append("query", query)
        formData.append("userid", userId)
        const response = await fetch(`${BASE_URL}/chat/get`, {
          method: "POST",
          body: formData
        })
    
        if(!response.ok ){
          toast.error("error fetching new resume chats")
          return;
        }
        const data = await response.json()
        const fetchedChats = data.chats
        console.log(fetchedChats)
        setResumeChats(fetchedChats)
        return fetchedChats
        
      }