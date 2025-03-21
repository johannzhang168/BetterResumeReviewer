
import { useUser } from "@/context/UseUser";
import NewResumeCard from "../components/dashboard/NewResumeCard";
import ResumeCard from "../components/dashboard/ResumeCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const user = useUser().currentUser
  const navigate = useNavigate()
  const resumes = [{ id: "1", title: "Resume 1", dateCreated: "Opened 1:48pm", coverImage: "blah blah" },
    { id: "1", title: "Resume 1", dateOpened: "Opened 1:48pm", coverImage: "blah blah" },
    { id: "1", title: "Resume 1", dateOpened: "Opened 1:48pm", coverImage: "blah blah" },
    { id: "1", title: "Resume 1", dateOpened: "Opened 1:48pm", coverImage: "blah blah" }
  ]


  // const handleUpload = () => {
  //   // Implement file upload logic HERE
  //   alert("Upload feature coming soon!");
  // };
  useEffect(() => {
    if(!user){
      navigate("/");
    }
  },) 

  return (
    <div className="min-h-screen bg-blue-100 p-6 flex justify-center min-w-[100px]">
      <div className="grid grid-cols-[repeat(auto-fit,252px)] mt-25 justify-center gap-x-6 gap-y-6 max-w-[85vw]">
        <NewResumeCard onClick={() => console.log("eeee")} />
        {resumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            id={resume.id}
            title={resume.title}
            dateOpened={new Date()}
            coverImage={resume.coverImage}
          />
        ))}
      </div>
    </div>


  );
};

export default Dashboard;