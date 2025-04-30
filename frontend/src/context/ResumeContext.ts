import React, { createContext} from "react";

interface ResumeChatData {
  id: string;
  title: string;
  dateCreated: string;
  lastUpdated: string;
  thumbnail: string;
}

interface ResumeChatProps {
  resumeChats: ResumeChatData[];
  setResumeChats: React.Dispatch<React.SetStateAction<ResumeChatData[]>>;
}

export const ResumeContext = createContext<ResumeChatProps | undefined>(undefined);
