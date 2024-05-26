import { useContext, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { userContext } from "../App";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Search = () => {
  const { tasks } = useContext(userContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleFilter = (value) => {
    const filteredData = tasks.filter((task) => task.title.includes(value));
    setData(filteredData);
  };

  const handleSearch = () => {
    if (data.length > 0) {
      const task = data[0];
      console.log("Aranan task:", task);
      navigate("/", { state: { task } });
      setSearchValue("");
      setData([]);
    } else {
      toast.error("Task Not Found")
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      setSearchValue(""); 
      setData([]); 
    }
  };

  return (
    <>
      <div className="flex justify-start">
        <div className="flex items-center bg-gray-100 shadow-md rounded-full p-1">
          <IoSearch className="text-gray-500 ml-1 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search Task"
            className="bg-transparent outline-none flex-grow w-80"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleFilter(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};

export default Search;
