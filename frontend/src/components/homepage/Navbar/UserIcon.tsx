import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/useUser";

const UserIcon:React.FC = () => {
  const navigate = useNavigate();
  const setCurrentUser = useUser().setCurrentUser;
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="w-12 h-12 rounded-full p-2 bg-gray-200 hover:shadow-lg hover:border hover:border-gray-200"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuItem onClick={() => handleLogout()}>
          <LogOut className="mr-2 h-4 w-4 text-red-500" />
          Log Out
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("settings")}>
          <Settings />
          Account Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserIcon
