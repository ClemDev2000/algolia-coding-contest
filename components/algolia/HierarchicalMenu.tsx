import { connectHierarchicalMenu } from 'react-instantsearch-dom';

const HierarchicalMenu = ({ items, refine, createURL, show }) => (
  <ul className={show ? 'mt-4 mb-1 space-y-1' : 'hidden'}>
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
          {item.label} ({item.count})
        </a>
        {item.items && (
          <HierarchicalMenu
            items={item.items}
            refine={refine}
            createURL={createURL}
            show={show}
          />
        )}
      </li>
    ))}
  </ul>
);

const CustomHierarchicalMenu = connectHierarchicalMenu(HierarchicalMenu);

export default CustomHierarchicalMenu;
