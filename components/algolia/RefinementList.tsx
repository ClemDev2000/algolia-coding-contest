import { Highlight, connectRefinementList } from 'react-instantsearch-dom';

const RefinementList = ({
  items,
  isFromSearch,
  refine,
  searchForItems,
  createURL,
  show,
}) => (
  <ul
    className={
      show ? 'mt-4 space-y-3 mb-1 p-2 border-b-2 border-gray-100' : 'hidden'
    }
  >
    <li>
      <div className="flex items-center w-1/2 md:w-2/6 mb-2 mt-2 py-1 border shadow-sm rounded-full border-gray-200">
        <form
          noValidate
          onSubmit={(ev) => ev.preventDefault()}
          role="search"
          className="flex items-center w-full px-5"
        >
          <input
            type="search"
            className="block w-full text-sm bg-white border-0 focus:ring-0 p-1 font-light text-gray-500 placeholder-gray-400"
            onChange={(event) => searchForItems(event.currentTarget.value)}
            placeholder="Search"
          />
        </form>
      </div>
    </li>
    {items.map((item) => (
      <li key={item.label}>
        <a
          href={createURL(item.value)}
          className={
            item.isRefined ? 'text-red-500 font-semibold' : 'text-gray-500'
          }
          onClick={(event) => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          {isFromSearch ? (
            <Highlight attribute="label" hit={item} />
          ) : (
            item.label
          )}{' '}
          ({item.count})
        </a>
      </li>
    ))}
  </ul>
);

const CustomRefinementList = connectRefinementList(RefinementList);

export default CustomRefinementList;
