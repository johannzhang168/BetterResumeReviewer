"use client";

interface NewResumeCardProps{
  onClick: () => void;
}
const NewResumeCard:React.FC<NewResumeCardProps> = ({onClick}) => {
    return (
      <div
      className="border border-gray-400 w-[283px] h-[333px] rounded-lg flex items-center justify-center hover:cursor-pointer hover:border-blue-500 bg-white"
      onClick={onClick}
      >
        <span className="text-4xl">+</span>
      </div>
    );
}

export default NewResumeCard;