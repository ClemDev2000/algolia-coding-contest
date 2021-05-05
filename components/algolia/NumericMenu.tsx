import { connectNumericMenu } from 'react-instantsearch-core';

const NumericMenu = ({ items, refine, createURL, show }) => (
  <ul
    className={
      show ? 'mt-4 mb-1 space-y-1 p-2 border-b-2 border-gray-100' : 'hidden'
    }
  >
    {items.map((item) => (
      <li key={item.value}>
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
          {item.label}
        </a>
      </li>
    ))}
  </ul>
);

const CustomNumericMenu = connectNumericMenu(NumericMenu);

export default CustomNumericMenu;
