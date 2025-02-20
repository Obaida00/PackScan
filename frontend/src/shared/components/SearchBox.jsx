import * as React from "react";
import { useState, useRef } from "react";

function SearchBox({ action, eraseOnPaste }) {
  const [search, _setSearch] = useState("");
  const inputRef = useRef(null);

  const setSearch = (value) => {
    _setSearch(value);
    if (value.length !== 0) {
      setTimeout(() => action(value), 0);
    }
  };

  // if the barcode reader relys on pasting which i think it does, then ur good to delete this, and it should be done so the value cannot be typed, its only available through the clipboard
  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("Text");

    if (eraseOnPaste) {
      setSearch(pastedText);
      setTimeout(() => {
        inputRef.current.select();
      }, 0);
    } else {
      setSearch((prev) => prev + pastedText);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSearch(event.target[0].value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center max-w-md mx-auto bg-white rounded-xl">
        <div className="w-full">
          <input
            ref={inputRef}
            type="search"
            name="searchBox"
            className="w-full px-4 py-1 text-gray-800 rounded-full outline-none focus:ring-0 border-none"
            placeholder="search"
            value={search}
            onPaste={handlePaste}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button
            type="submit"
            className="flex place-items-center bg-slate-800 justify-center w-12 h-12 text-white rounded-r-lg cursor-pointer"
            disabled={search.length === 0}
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
