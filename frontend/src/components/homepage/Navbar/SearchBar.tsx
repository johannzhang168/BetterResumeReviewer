import { useState } from "react";
import { Search, X } from "lucide-react"; // Lucide icons for better styling
import { useResume } from "@/context/UseResume";
import { fetchResumeChats } from "@/actions/FetchResumeChats";
import { useUser } from "@/context/UseUser";

// interface SearchBarProps{

//   onSubmit: () => void;
// }
const SearchBar:React.FC= () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = useUser().currentUser;
  const setResumeChats = useResume().setResumeChats;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = async (reset?: boolean) => {
    if(!currentUser) return
    try{
      setLoading(true);
      if(reset){
        await fetchResumeChats(currentUser?.id, setResumeChats)
      }
      else{
        console.log(searchText)
        await fetchResumeChats(currentUser?.id, setResumeChats, searchText)
      }
      setLoading(false);
    }catch(error){
      console.error("Error fetching resumes:", error);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
 

  const clearSearch = async () => {
    setSearchText("");
    await handleSearch(true);
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full max-w-lg">
      <Search className="w-5 h-5 text-gray-500 mr-3" />
      <input
        type="text"
        placeholder={loading ? "Loading..." : "Search"}
        value={loading ? "Loading..." : searchText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"
      />
      {searchText && !loading && (
        <button
          onClick={clearSearch}
          className="ml-3 w-8 h-8 flex items-center justify-center rounded-full transform hover:bg-gray-300 duration-300 ease-in-out"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
