import { Fragment, useContext, useState } from 'react';
import CustomResults from '../components/algolia/Results';
import CustomHitsProducts from '../components/ProductsHits';
import { ConfigureIndexProducts } from '../components/algolia/ConfigureAlgolia';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { RefreshContext, UserContext } from '../lib/context';
import CustomSearchBox from '../components/algolia/SearchBox';
import CustomNumericMenu from '../components/algolia/NumericMenu';
import CustomRefinementList from '../components/algolia/RefinementList';
import CustomClearRefinements from '../components/algolia/ClearRefinements';
import CustomHierarchicalMenu from '../components/algolia/HierarchicalMenu';
import Map from '../components/Map';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export default function Content() {
  const { refresh } = useContext(RefreshContext);
  return (
    <InstantSearch
      refresh={refresh}
      searchClient={searchClient}
      indexName={process.env.NEXT_PUBLIC_INDEX_PRODUCTS}
    >
      <main className="grid grid-cols-5 h-full">
        <Products />
        <Map />
      </main>
    </InstantSearch>
  );
}

function NumericMenuFilter({ type }) {
  return (
    <CustomNumericMenu
      show={type === 'price'}
      attribute="amount"
      items={[
        { label: '<= €10', end: 10 },
        { label: '€10 - €100', start: 10, end: 100 },
        { label: '€100 - €500', start: 100, end: 500 },
        { label: '>= €500', start: 500 },
      ]}
    />
  );
}

function RefinementList({ type, attribute, text }) {
  return (
    <CustomRefinementList
      show={type === text}
      attribute={attribute}
      searchable
    />
  );
}

function HierarchicalMenu({ type, text }) {
  return (
    <CustomHierarchicalMenu
      show={type === text}
      attributes={['categories.lvl0', 'categories.lvl1']}
    />
  );
}

function FilterSelector({ text, type, setType }) {
  return (
    <button
      className="relative inline-block text-left focus:outline-none"
      onClick={() => setType(type === text ? '' : text)}
    >
      <div
        className={`inline-flex justify-center capitalize w-full px-3 py-1 text-sm border text-gray-500 hover:border-red-500 font-medium hover:text-red-500 bg-white rounded-full hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
          text === type ? 'text-red-500 border-red-500' : ''
        }`}
      >
        {text}
        <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
      </div>
    </button>
  );
}

function MyProductsSelector({ myProducts, setMyProducts }) {
  return (
    <button
      className="relative inline-block text-left focus:outline-none"
      onClick={() => setMyProducts(!myProducts)}
    >
      <div
        className={`inline-flex justify-center w-full px-3 py-1 text-sm border text-gray-500 hover:border-red-500 font-medium hover:text-red-500 bg-white rounded-full hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
          myProducts ? 'text-red-500 border-red-500' : ''
        }`}
      >
        My products
      </div>
    </button>
  );
}

function Products() {
  const { user } = useContext(UserContext);
  const [resetSearch, setResetSearch] = useState(false);
  const [type, setType] = useState('');
  const [myProducts, setMyProducts] = useState(true);
  return (
    <>
      {/* Algolia configurations */}
      <Configure
        userToken={user?.uid}
        clickAnalytics
        enablePersonalization
        analytics
        page={0}
        filters={
          user
            ? myProducts
              ? `user.id:${user.uid}`
              : `NOT user.id:${user.uid}`
            : undefined
        }
      />
      <div className="w-full h-full col-span-5 md:col-span-3 px-5 overflow-y-scroll">
        {/* Main search box */}
        <CustomSearchBox
          resetSearch={resetSearch}
          setResetSearch={setResetSearch}
        />

        {/* Filters */}
        <div className="flex space-x-2 mb-3 overflow-x-scroll">
          <FilterSelector text="price" type={type} setType={setType} />
          <FilterSelector text="seller" type={type} setType={setType} />
          <FilterSelector text="city" type={type} setType={setType} />
          <FilterSelector text="categories" type={type} setType={setType} />
          <CustomClearRefinements setType={setType} />
          {user && (
            <MyProductsSelector
              myProducts={myProducts}
              setMyProducts={setMyProducts}
            />
          )}
        </div>

        {/* Filters content */}
        <NumericMenuFilter type={type} />
        <RefinementList text="seller" attribute="user.name" type={type} />
        <RefinementList text="city" attribute="user.city" type={type} />
        <HierarchicalMenu text="categories" type={type} />

        {/* Results */}
        <ConfigureIndexProducts>
          <CustomResults>
            <CustomHitsProducts />
          </CustomResults>
        </ConfigureIndexProducts>
      </div>
    </>
  );
}
