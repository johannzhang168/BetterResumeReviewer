import { useState } from "react";
import { Search, X } from "lucide-react"; // Lucide icons for better styling

interface SearchBarProps{
  onChange: (arg:string) => void;
}
const SearchBar:React.FC<SearchBarProps> = ({ onChange }) => {
  const [searchText, setSearchText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onChange?.(e.target.value); 
  };

  const clearSearch = () => {
    setSearchText("");
    onChange?.(""); 
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full max-w-lg">
      <Search className="w-5 h-5 text-gray-500 mr-3" />
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={handleChange}
        className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500"
      />
      {searchText && (
        <button onClick={clearSearch} className="ml-3 w-8 h-8 flex items-center justify-center rounded-full transform hover:bg-gray-300 duration-300 ease-in-out">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
