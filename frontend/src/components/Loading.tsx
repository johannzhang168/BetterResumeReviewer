"use client"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: number
  className?: string
  color?: string
}

const LoadingSpinner: React.FC = ({ size = 24, className, color = "text-primary" }: LoadingSpinnerProps) => {
  return <Loader2 className={cn("animate-spin", color, className)} size={size} aria-label="Loading" />
}

export default LoadingSpinner