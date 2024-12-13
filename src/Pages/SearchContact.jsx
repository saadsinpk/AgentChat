import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

function SearchBar({ SearchValue }) {
  const [search, setsearch] = useState('');

  const handleSearch = (e) => {
    console.log(e.target.value);
    setsearch(e.target.value);
    SearchValue(e.target.value);
  };

  const handleClear = () => setsearch('');

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <div className="relative w-full md:w-full">
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FiSearch />
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="w-full bg-[#19335F] text-white placeholder-gray-400 py-2 pl-8 pr-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        {search && (
          <button
            aria-label="Clear search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={handleClear}
          >
            <FiX />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
