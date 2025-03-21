import React, {  useState, useEffect } from "react";
import { GetCurrentUser } from "@/actions/GetCurrentUser";
import { UserContext } from "./UserContext";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("jwt");
      if (!token){
        return;
      } 
      try {
        const response = await GetCurrentUser();
        setCurrentUser(response);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};


