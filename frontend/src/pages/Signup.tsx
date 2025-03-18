"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import { Github } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password must be at most 64 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character (!@#$%^&*)"),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, "Graduation year must be a 4-digit number."),
});

export default function Signup() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:"",
      firstName: "",
      lastName: "",
      graduationYear: "",
    },
  });

  const [userId, setUserId] = useState("");
  const BASEURL = import.meta.env.VITE_API_BASE_URL;
  console.log(BASEURL)

  useEffect(() => {
    document.body.style.overflow = "hidden";
    scrollToEmail();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const scrollToEmail = () => {
    const element = document.getElementById("email");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const scrollToName = () => {
    const element = document.getElementById("name");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const scrollToGraduation = () => {
    const element = document.getElementById("graduationyear");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (data: { email: string; password?: string; firstName: string; lastName: string; graduationYear: string; }) => {
    if (userId !== ""){
      delete data.password
      const response = await fetch(`${BASEURL}/user/${userId}`, {
        method: "PUT",  // ✅ Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),   
      })
      const re = await response.json()
      if(!response.ok){
        throw new Error(re.detail)
      }
    }
    else{
      const response = await fetch(`${BASEURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const re = await response.json()
      if(!response.ok){
        throw new Error(re.detail)
      }
    }
    navigate("/dashboard");
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    console.log(BASEURL)
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
        form.setValue("email", user.email || "oauth@placeholder.com");
        form.setValue("password", "Oauth-password123")
        form.setValue("firstName", user.firstName || "");
        form.setValue("lastName", user.lastName || "");
        setUserId(user.id);
        // console.log(user.id);
      }
    };
  
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  },);

  useEffect(() => {
    if (userId !== "") {
      console.log(userId)
      scrollToName();
    }
  }, [userId])

  return (
    <div
      className="relative min-h-screen transition-all duration-500 min-w-[100px]"
      style={{
        background: `linear-gradient(45deg, 
          rgba(255, 255, 255, 1) 0%, 
          rgba(200, 230, 255, ${0.5 + scrollY / 2000}) 40%, 
          rgba(150, 200, 250, ${0.3 + scrollY / 3000}) 100%)`,
      }}
      >
        <div className="min-h-[200vh] flex flex-col items-center justify-center">   
          <div id="email" className="h-screen flex flex-col justify-center w-[50vw] space-y-5">
          <TypeAnimation
            sequence={[
              "Just a few steps before you're on your way...", 
              1000
            ]}
            wrapper="span"
            className="text-4xl font-semibold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent"
            speed={50} 
            repeat={0}
          />
            <div className="space-y-5">

            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl">Email</FormLabel>
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
                      <FormLabel className="text-2xl">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" className="bg-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="mt-4 w-full"
                  type="button"
                  onClick={async () => {
                    const isValidEmail = await form.trigger("email");
                    const isValidPassword = await form.trigger("password")
                    if (isValidEmail && isValidPassword) {  
                      scrollToName();
                    }
                  }}
                >
                  Continue
                </Button>
              </form>
            </Form>
            <div className="flex md:flex-row flex-col gap-y-3 justify-between mt-6">
              <Button className="md:w-[24vw] w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600" 
                onClick={async () => handleOAuthLogin("google")}
              >
                <FaGoogle/>
                Sign up with Google
              </Button>

              <Button className="md:w-[24vw] w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                onClick={async () => handleOAuthLogin("github")}
              >
                <Github />
                Sign up with GitHub
              </Button>
            </div>
          </div>
          <div id="name" className="h-screen flex flex-col justify-center w-[50vw]">
            <Form {...form} >
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">First Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter your first name" className="bg-white" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">Last Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter your last name" className="bg-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {userId === "" ? (
                  <div className="flex flex-row justify-between">
                    <Button
                      className="mt-4 w-4/9"
                      type="button"
                      onClick={() => scrollToEmail()}
                    >
                      Back
                    </Button>
                    <Button
                      className="mt-4 w-4/9"
                      type="button"
                      onClick={async () => {
                        const isValidFirst = await form.trigger("firstName");
                        const isValidLast = await form.trigger("lastName");
                        if (isValidFirst && isValidLast) {
                          scrollToGraduation();
                        }
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                ) :  
                <Button
                  className="mt-4 w-full"
                  type="button"
                  onClick={async () => {
                    const isValidFirst = await form.trigger("firstName");
                    const isValidLast = await form.trigger("lastName");
                    if (isValidFirst && isValidLast) {
                      scrollToGraduation();
                    }
                  }}
                >
                  Continue
                </Button>
              }
              </form>
            </Form>
          </div>
          <div id="graduationyear" className="h-screen flex flex-col justify-center w-[50vw] ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-semibold">Graduation Year</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter your graduation year" className="bg-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row justify-between">
                  <Button
                    className="mt-4 w-4/9"
                    type="button"
                    onClick={() => scrollToName()}
                  >
                    Back
                  </Button>
                  <Button className="mt-4 w-4/9" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    
  );
}
