import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"

const UserIcon:React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="w-12 h-12 rounded-full p-1 hover:bg-gray-200"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <DropdownMenuItem onClick={() => console.log("logout")}>
          <LogOut className="mr-2 h-4 w-4" />
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
