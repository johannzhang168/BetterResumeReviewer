
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
      <Button className="mt-8 gap-2" onClick={() => navigate("/")}>
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
      </Button>
    </div>
  )
}

export default NotFound