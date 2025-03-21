"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Github } from "lucide-react"
import { useEffect, useState } from "react"
import { FaGoogle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/context/useUser"
import toast from "react-hot-toast"
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(1, "Please enter a password")
})

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const BASEURL = import.meta.env.VITE_API_BASE_URL;
  const setCurrentUser = useUser().setCurrentUser;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
    },
  });
  const handleSubmit = async (data: {email: string, password: string}) => {
    try {
      const response = await fetch(`${BASEURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),   
      });
      const re = await response.json();
      if(response.status === 401){
        toast.error("Invalid Email or Password");
        return
      }
      if (!response.ok) {
        throw new Error(re.detail || "Login failed");
      }

      localStorage.setItem("jwt", re.token);
      setCurrentUser(re.user);
    
      if (!re.user.graduationYear) {
        navigate("/signup");
      } else {
        toast.success("Logged in!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="Enter your password"
                          className="bg-white pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-500 hover:cursor-pointer"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>

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

