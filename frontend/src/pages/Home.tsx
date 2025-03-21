import { useEffect, useState } from "react";
import { Hero } from "../components/homepage/Hero";
import { Problem } from "../components/homepage/Problem";
import { Solution } from "../components/homepage/Solution";
import { SignUpToday } from "../components/homepage/SignUpToday";
import { useUser } from "@/context/UseUser";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const currentUser = useUser().currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if(currentUser){
      console.log(currentUser)
      navigate("/dashboard")
    }
  },)

  return (
    <div
      className="relative min-h-screen transition-all duration-500"
      style={{
        background: `linear-gradient(45deg, 
          rgba(255, 255, 255, 1) 0%, 
          rgba(200, 230, 255, ${0.5 + scrollY / 2000}) 40%, 
          rgba(150, 200, 250, ${0.3 + scrollY / 3000}) 100%)`,
      }}
    >
      <Hero />
      {/* Add in demo once rest of app is done */}
      <Problem />
      <Solution />
      <SignUpToday/>
    </div>
  );
}

export default Home
