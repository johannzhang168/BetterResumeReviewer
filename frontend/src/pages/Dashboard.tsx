
import NewResumeCard from "../components/dashboard/NewResumeCard";
import ResumeCard from "../components/dashboard/ResumeCard";

const Dashboard: React.FC = () => {
  // Sample resume data
  const resumes = [{ id: "1", title: "Resume 1", dateCreated: "Opened 1:48pm", coverImage: "blah blah" },
    { id: "1", title: "Resume 1", dateOpened: "Opened 1:48pm", coverImage: "blah blah" },
    { id: "1", title: "Resume 1", dateOpened: "Opened 1:48pm", coverImage: "blah blah" },
    { id: "1", title: "Resume 1", dateOpened: "Opened 1:48pm", coverImage: "blah blah" }
  ]


  // const handleUpload = () => {
  //   // Implement file upload logic HERE
  //   alert("Upload feature coming soon!");
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-6 justify-center">
      <div className="grid grid-cols-[repeat(auto-fit,283px)] mt-25 justify-center gap-x-6 gap-y-6">
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