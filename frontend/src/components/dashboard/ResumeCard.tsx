"use client";
// import { Navigate } from "react-router-dom";

interface ResumeCardProps {
  id: string;
  title: string;
  dateOpened: Date;
  coverImage: string;
}
const ResumeCard:React.FC<ResumeCardProps> = ({id, title, dateOpened, coverImage}) => {
  return(
    <div key={id} onClick={() => console.log("eeeee")} className="border border-gray-400 rounded-lg bg-white p h-[333px] w-[252px] hover:cursor-pointer hover:border-blue-500">
      <div className="h-9/12 rounded-t-lg overflow-hidden border-b border-gray-400">
        <img src={coverImage} alt="Resume Cover Image" className="w-full h-full object-cover" />
      </div>
      <div className="pl-4 pt-1">
        <p className="text-lg font-bold truncate">{title}</p> 
        <div className="flex items-center gap-x-2 mt-1">
          <img src="./image.png" className="w-8 h-9 opacity-80" />
          <p className="text-sm font-bold text-gray-400">
            {new Date(dateOpened).toDateString() === new Date().toDateString()
              ? `Opened ${new Date(dateOpened).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`
              : `Opened ${new Date(dateOpened).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </p>

        </div>
      </div>
     
    </div>
  );

}

export default ResumeCard