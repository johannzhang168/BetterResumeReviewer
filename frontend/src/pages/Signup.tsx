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
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { useUser } from "@/context/useUser";
import toast from "react-hot-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


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

enum SignupStep {
  EMAIL = "email",
  NAME = "name",
  GRADUATION_YEAR = "graduationYear",
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const {currentUser, setCurrentUser} = useUser()
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

  const [userId, setUserId] = useState(currentUser?.id || "");
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState( SignupStep.EMAIL);
  const BASEURL = import.meta.env.VITE_API_BASE_URL;

  const emailRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const graduationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";  
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() =>{
    if (currentUser) {
      setCurrentStep(SignupStep.NAME)

      form.setValue("email", currentUser.email || "oauth@placeholder.com");
      form.setValue("password", "Oauth-password123")
      setUserId(currentUser.id);
    }
  }, [form, currentUser])

  useEffect(() => {
    const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
    if (currentStep === SignupStep.EMAIL) scrollToRef(emailRef);
    if (currentStep === SignupStep.NAME) scrollToRef(nameRef);
    if (currentStep === SignupStep.GRADUATION_YEAR) scrollToRef(graduationRef);
  }, [currentStep]);

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
      setCurrentUser(re.user)
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
      if(response.status === 409){
        toast.error("User with this email already exists! Please log in instead")
        return
      }
      if(!response.ok){
        throw new Error(re.detail)
      }
      setCurrentUser(re.user)
    }
    navigate("/dashboard");
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
        form.setValue("email", user.email || "oauth@placeholder.com");
        form.setValue("password", "Oauth-password123")
        form.setValue("firstName", user.firstName || "");
        form.setValue("lastName", user.lastName || "");
        setUserId(user.id);
      }
    };
  
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  },);

  useEffect(() => {
    if (userId !== "") {
      setCurrentStep(SignupStep.NAME)
    }
  }, [userId])

  return (
    <div
      className="relative min-h-[200vh] transition-all duration-500 min-w-[200px] flex justify-center items-center "
      style={{
        background: `linear-gradient(45deg, 
          rgba(255, 255, 255, 1) 0%, 
          rgba(200, 230, 255, ${0.5 + scrollY / 2000}) 40%, 
          rgba(150, 200, 250, ${0.3 + scrollY / 3000}) 100%)`,
      }}
      >
        <div className="flex flex-col items-center justify-center w-2/3 mt-100">
          <div ref={emailRef} className="h-screen flex flex-col justify-center w-full space-y-5">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                Sign up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto">
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
                      type="button"
                      onClick={async () => {
                        const isValidEmail = await form.trigger("email")
                        const isValidPassword = await form.trigger("password")
                        if (isValidEmail && isValidPassword) {
                          setCurrentStep(SignupStep.NAME)
                        }
                      }}
                    >
                      Continue
                    </Button>
                  </form>
                </Form>

                <div className="flex justify-center items-center">
                  <Separator.Root className="flex-1 h-px bg-gray-300" />
                  <span className="px-4 text-gray-500 text-sm">OR</span>
                  <Separator.Root className="flex-1 h-px bg-gray-300" />
                </div>

                <div className="flex md:flex-row flex-col gap-y-3 gap-x-3 justify-between">
                  <Button
                    className="md:w-5/11 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                    onClick={async () => handleOAuthLogin("google")}
                  >
                    <FaGoogle />
                    Sign up with Google
                  </Button>

                  <Button
                    className="md:w-5/11 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 hover:cursor-pointer text-white"
                    onClick={async () => handleOAuthLogin("github")}
                  >
                    <Github />
                    Sign up with GitHub
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/login" className="text-primary  underline-offset-4 hover:underline hover:text-blue-500">
                    Sign in
                  </a>
                </p>
              </CardFooter>
            </Card>
          </div>
          <div ref={nameRef} className="h-screen flex flex-col justify-center w-full">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>
                  <span  className="text-3xl font-semibold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    Just a couple quick questions...
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Form {...form} >
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-2xl font-semibold">Whats your first name?</FormLabel>
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
                          <FormLabel className="text-2xl font-semibold">Whats your last name?</FormLabel>
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
                          className="mt-4 w-4/9 hover:cursor-pointer"
                          type="button"
                          onClick={() => setCurrentStep(SignupStep.EMAIL)}
                        >
                          Back
                        </Button>
                        <Button
                          className="mt-4 w-4/9 bg-blue-600 hover:bg-blue-500 hover:cursor-pointer"
                          type="button"
                          onClick={async () => {
                            const isValidFirst = await form.trigger("firstName");
                            const isValidLast = await form.trigger("lastName");
                            if (isValidFirst && isValidLast) {
                              setCurrentStep(SignupStep.GRADUATION_YEAR);
                            }
                          }}
                        >
                          Continue
                        </Button>
                      </div>
                    ) :  
                    <Button
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-500 hover:cursor-pointer"
                      type="button"
                      onClick={async () => {
                        const isValidFirst = await form.trigger("firstName");
                        const isValidLast = await form.trigger("lastName");
                        if (isValidFirst && isValidLast) {
                          setCurrentStep(SignupStep.GRADUATION_YEAR);
                        }
                      }}
                    >
                      Continue
                    </Button>
                  }
                  </form>
                </Form>
              </CardContent>
            </Card>
            
          </div>
          <div ref={graduationRef} className="h-screen flex flex-col justify-center w-full ">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-2xl font-semibold">What year are you graduating?</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter your graduation year" className="bg-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row justify-between ">
                    <Button
                      className="mt-4 w-4/9 hover:cursor-pointer"
                      type="button"
                      onClick={() => setCurrentStep(SignupStep.NAME)}
                    >
                      Back
                    </Button>
                    <Button className="mt-4 w-4/9 bg-blue-600 hover:bg-blue-500 hover:cursor-pointer" type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
  );
}

export default Signup
