import { connectNumericMenu } from 'react-instantsearch-core';

const NumericMenu = ({ items, refine, show }) => (
  <ul className={show ? 'mt-4 mb-1 space-y-1' : 'hidden'}>
    {items.map((item) => (
      <li key={item.value} className="flex items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          <input
            id={item.name}
            name={item.name}
            type="radio"
            readOnly
            checked={item.isRefined}
            className="focus:ring-red-500 h-4 w-4 text-red-500 border-gray-300"
          />
          <label
            htmlFor={item.name}
            className="ml-3 block text-sm font-medium text-gray-700"
          >
            {item.label}
          </label>
        </div>
      </li>
    ))}
  </ul>
);

const CustomNumericMenu = connectNumericMenu(NumericMenu);

export default CustomNumericMenu;
