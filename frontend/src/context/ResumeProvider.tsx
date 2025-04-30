import React, {useState} from "react";
// import { fetchResumeChats } from "@/actions/FetchResumeChats";
import { ResumeContext } from "./ResumeContext";

interface ResumeChatData {
        id: string;
        title: string;
        dateCreated: string;
        lastUpdated: string;
        thumbnail: string;
      }

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const [resumeChats, setResumeChats] = useState<ResumeChatData[]>([]);
        return (
            <ResumeContext.Provider value={{ resumeChats, setResumeChats }}>
              {children}
            </ResumeContext.Provider>
        );
}

