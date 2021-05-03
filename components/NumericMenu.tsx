import { connectNumericMenu } from 'react-instantsearch-core';

const NumericMenu = ({ items, refine }) => (
  <ul>
    {items.map((item) => (
      <li key={item.value}>
        <a
          href="#"
          className={item.isRefined ? 'font-semibold' : 'font-normal'}
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

// 2. Connect the component using the connector
const CustomNumericMenu = connectNumericMenu(NumericMenu);

export default CustomNumericMenu;
