"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, X, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import {z} from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUser } from "@/context/UseUser"
import { useNavigate } from "react-router-dom"


const formSchema = z.object({
  chatName: z.string().min(1, "You must enter a name"),
  jobDescription: z
  .string()
  .min(1, "please enter a job description"),
  resume: z.custom<File>()
  .refine((file) => file instanceof File, {
    message: "Resume is required",
  })
  .refine(
    (file) =>
      ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file?.type),
    {
      message: "File must be a PDF or DOCX",
    }
  )
  .refine((file) => file?.size <= 5 * 1024 * 1024, {
    message: "File must be less than 5MB",
  }),
})

const ChatCreationForm: React.FC = ()  => {
  
  const [isDragging, setIsDragging] = useState(false)
  const [resume, setResume] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const user = useUser().currentUser
  const navigate = useNavigate();
  useEffect(() => {
      if(!user){
        navigate("/");
      }
    },) 
  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        chatName: "",
        jobDescription:"",
        resume: undefined,
      },
    });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log("here")
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    console.log(file instanceof File );
    const fileType = file.type
    if (
      fileType !== "application/pdf"
    ) {
      toast.error("Please upload your resume as a PDF file!")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum file size is 5MB")
      return
    }
    setResume(file)
    form.setValue("resume", file)
  }

  const removeFile = () => {
    form.resetField("resume")
    setResume(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (data: {chatName:string, jobDescription: string, resume: File}) => {
    const formData = new FormData();
    if(user){
      formData.append("userId", user.id)
    }
    formData.append("chatName", data.chatName);
    formData.append("jobDescription", data.jobDescription);
    if (resume) {
      formData.append("resume", resume);
    }
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try{
      setIsSubmitting(true)
      
      const response = await fetch(`${BASE_URL}/chat/create`, {
        method: "POST",
        body: formData,
      });
      
      const re = await response.json();
      if(re.status != 200){
        toast.error("Error creating new chat")
        console.log(re)
        return
      }
      setIsSubmitting(false)
      re.user = user
      navigate(`/chat/${re.chat}`, {state: {data: re}})
    } catch(error){
      console.log("error", error)
    }  
  }

  return (
    <div className="min-h-screen min-w-[300px] flex w-full justify-center items-center bg-blue-100">
      <Card className="mt-30 md:w-[50vw] sm:w-[90vw] mb-5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a Chat</CardTitle>
        </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField control={form.control} name="chatName" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="chatName">Chat Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter the name of the chat" className="bg-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="jobDescription" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="jobDescription">Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="jobDescription"
                          placeholder="Enter the job description or paste it here"
                          rows={5}
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="resume">Resume</FormLabel>
                      <FormControl>
                        {!resume ? (
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => {
                              console.log("drop")
                              handleDrop(e);
                              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                const file = e.dataTransfer.files[0];
                                field.onChange(file);
                              }
                              
                            }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium mb-1">Drag and drop your resume here or click to browse</p>
                            <p className="text-xs text-muted-foreground">Supports PDF, DOCX (Max 5MB)</p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              id="resume"
                              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              onChange={(e) => {
                                handleFileChange(e);
                                field.onChange(e.target.files?.[0] || null);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="border rounded-lg p-4 bg-muted/30">
                            <div className="flex items-center">
                              <FileText className="h-8 w-8 mr-3 text-primary" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{resume.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(resume.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  removeFile();
                                  field.onChange(null); // Clear form field
                                }}
                                className="ml-2"
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove file</span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />   
              <CardFooter className="mt-5">
                <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-500 hover:cursor-pointer" type="submit">
                  {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Create Chat
                      </>
                    )}
                  </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
   
  )
}

export default ChatCreationForm

