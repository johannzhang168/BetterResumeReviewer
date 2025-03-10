import { useState } from "react";

const Dashboard: React.FC = () => {
  // Sample resume data
  const [resumes, setResumes] = useState([
    { id: 1, name: "Resume 1", date: "Opened 1:48pm" },
    { id: 2, name: "Resume 2", date: "Opened March 7, 2025" },
    { id: 3, name: "Resume 3", date: "Opened February 5, 2025" },
  ]);

  const handleUpload = () => {
    // Implement file upload logic HERE
    alert("Upload feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Standard View</h2>
        <div className="p-2 bg-gray-200 rounded-full cursor-pointer">
          {/* Future: Profile settings here... */}
          <span className="text-lg">👤</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded-lg w-1/2"
        />
      </div>

      {/* Resume Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Upload New Resume Card */}
        <div
          className="border border-gray-400 rounded-lg flex items-center justify-center cursor-pointer h-48 bg-white"
          onClick={handleUpload}
        >
          <span className="text-4xl">+</span>
        </div>

        {/* Uploaded Resumes */}
        {resumes.map((resume) => (
          <div key={resume.id} className="border border-gray-400 rounded-lg bg-white p-4">
            <div className="h-32 bg-gray-300 mb-4 flex items-center justify-center">
              {/* Placeholder for resume preview */}
              <span className="text-gray-600">Resume Preview</span>
            </div>
            <h3 className="font-bold">{resume.name}</h3>
            <p className="text-sm text-gray-600">{resume.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;