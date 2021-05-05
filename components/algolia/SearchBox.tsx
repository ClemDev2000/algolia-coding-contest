import { SearchIcon } from '@heroicons/react/outline';
import { useEffect } from 'react';
import { connectSearchBox } from 'react-instantsearch-core';

const SearchBox: React.FC<any> = ({
  currentRefinement,
  refine,
  resetSearch,
  setResetSearch,
}) => {
  useEffect(() => {
    if (resetSearch) {
      if (document.getElementById('scrollProducts'))
        document.getElementById('scrollProducts')!.scrollTop = 0;
      refine(currentRefinement);
      setResetSearch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSearch]);

  return (
    <div className="flex items-center w-full mx-auto mt-5 mb-3 py-2 border shadow-sm rounded-full border-gray-200">
      <form
        noValidate
        onSubmit={(ev) => ev.preventDefault()}
        role="search"
        className="flex items-center w-full px-5"
      >
        <input
          type="search"
          maxLength={100}
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
          className="block w-full text-base md:text-lg bg-white border-0 focus:ring-0 p-1 font-normal text-gray-500 placeholder-gray-400"
          placeholder="Search products by name, description"
        />
        <div className="bg-red-500 rounded-full p-2 cursor-pointer">
          <SearchIcon className="h-5 w-5 text-white" />
        </div>
      </form>
    </div>
  );
};
const CustomSearchBox = connectSearchBox(SearchBox);

export default CustomSearchBox;
