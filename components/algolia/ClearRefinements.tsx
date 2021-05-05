import { connectCurrentRefinements } from 'react-instantsearch-dom';

const ClearRefinements = ({ items, refine, setType }) => (
  <button
    className="relative inline-block text-left focus:outline-none"
    onClick={() => {
      refine(items);
      setType('');
    }}
    disabled={!items.length}
  >
    <div className="inline-flex justify-center capitalize w-full px-3 py-1 text-sm border text-gray-500 hover:border-red-500 font-medium hover:text-red-500 bg-white rounded-full hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
      Clear
    </div>
  </button>
);

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);

export default CustomClearRefinements;
