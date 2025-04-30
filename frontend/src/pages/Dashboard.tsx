
import { useUser } from "@/context/UseUser";
import NewResumeCard from "../components/dashboard/NewResumeCard";
import ResumeCard from "../components/dashboard/ResumeCard";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useResume } from "@/context/UseResume";


// interface ResumeChatData {
//   id: string;
//   title: string;
//   dateCreated: string;
//   lastUpdated: string;
//   thumbnail: string;
// }
const Dashboard: React.FC = () => {
  const user = useUser().currentUser
  const navigate = useNavigate()
  const {resumeChats, setResumeChats} = useResume();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

  useEffect(() => {
    if(!user){
      navigate("/");
    }
    else{
      fetchResumeChats(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]) 

  const fetchResumeChats = async (userId: string, query?: string, ) => {
    const formData = new FormData();
    if(query) formData.append("query", query)
    formData.append("userid", userId)
    const response = await fetch(`${BASE_URL}/chat/get`, {
      method: "POST",
      body: formData
    })

    if(!response.ok ){
      toast.error("error fetching new resume chats")
      return;
    }
    const data = await response.json()
    const fetchedChats = data.chats
    console.log(fetchedChats)
    setResumeChats(fetchedChats)
    
  }

  return (
    <div className="min-h-screen bg-blue-100 p-6 flex justify-center min-w-[100px]">
      <div className="grid grid-cols-[repeat(auto-fit,252px)] mt-25 justify-center gap-x-6 gap-y-6 max-w-[85vw]">
        <NewResumeCard onClick={() => navigate("/chat/create")} /> {/*need to change this to whne click, set the updatedAt to the current date*/}
        {resumeChats.map((resume) => (
          <ResumeCard
            key={resume.id}
            id={resume.id}
            title={resume.title}
            dateCreated={resume.dateCreated}
            lastUpdated={resume.lastUpdated}
            coverImage={resume.thumbnail}
          />
        ))}
      </div>
    </div>


  );
};

export default Dashboard;