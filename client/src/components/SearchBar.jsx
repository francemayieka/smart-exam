import React, { useState } from "react";
import { toast } from "react-toastify";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm) {
      toast.info(`Searching for ${searchTerm}`);
    } else {
      toast.error("Please enter a search term");
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Course"
        className="border rounded-full p-2 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-full">
        <span className="material-icons">search</span>
      </button>
    </div>
  );
};

export default SearchBar;
