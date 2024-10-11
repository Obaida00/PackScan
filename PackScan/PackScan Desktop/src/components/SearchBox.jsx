import { useEffect, useState } from "react";

function SearchBox({ action }) {
  const [search, setSearch] = useState("");

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearch(event.target[0].value);
    getSearchResults(search);
  };

  useEffect(() => {
    getSearchResults(search);
  }, [search]);

  const getSearchResults = (search) => {
    if (search.length == 0) return;
    action(search);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center max-w-md mx-auto bg-white rounded-xl ">
        <div className="w-full">
          <input
            type="search"
            name="searchBox"
            className="w-full px-4 py-1 text-gray-800 rounded-full outline-none focus:ring-0 border-none"
            placeholder="search"
            value={search}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex place-items-center bg-slate-800 justify-center w-12 h-12 text-white rounded-r-lg cursor-pointer"
            disabled={search.length == 0}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBox;
