import React, { createContext} from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  chats: string[];
  status: string;
}

interface UserContextProps {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);