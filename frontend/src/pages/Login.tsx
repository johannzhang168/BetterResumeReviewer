"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Github } from "lucide-react"
import { useEffect, useState } from "react"
import { FaGoogle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/context/useUser"
import toast from "react-hot-toast"

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_API_BASE_URL;
  const setCurrentUser = useUser().setCurrentUser;
  // This would handle the email/password login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
  }
  const handleOAuthLogin = async (provider: "google" | "github") => {
    const authWindow = window.open(
      `${BASEURL}/auth/${provider}`,
      "_blank",
      "width=500,height=600"
    );
    
    const checkPopup = setInterval(() => {
      if (!authWindow || authWindow.closed) {
        clearInterval(checkPopup);
      }
    }, 1000);
  }

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== BASEURL) return;
      const { token, user } = event.data;
      if (token) {
        localStorage.setItem("jwt", token);
        setCurrentUser(user)
        console.log(user)
        if(!user.graduationYear){
          navigate("/signup")
        }
        else{
          toast.success("Logged in!")
          navigate("/dashboard")
        }
      }
    };
  
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  },);

  useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);
  
  const [showPassword, setShowPassword] = useState(false);
  


  return (
    <div
      className="relative min-h-screen transition-all duration-500 min-w-[300px] flex justify-center items-center"
      style={{
        background: `linear-gradient(45deg, 
          rgba(255, 255, 255, 1) 0%, 
          rgba(200, 230, 255, ${0.5 + scrollY / 2000}) 40%, 
          rgba(150, 200, 250, ${0.3 + scrollY / 3000}) 100%)`,
      }}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your email and password to login to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className="bg-white pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div> 
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                Login
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="destructive" type="button" className=" bg-red-500 hover:bg-red-600 text-white" onClick={() => handleOAuthLogin("google")}>
                <FaGoogle className="mr-2 h-4 w-4 "/>
                Sign in with Google
              </Button>
              <Button type="button" className=" bg-gray-900 hover:bg-gray-800 text-white" onClick={() =>  handleOAuthLogin("github")}>
                <Github className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Forgot your password?
              </a>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
      
  )
}

export default LoginForm

