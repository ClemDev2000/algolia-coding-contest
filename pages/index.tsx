import Head from 'next/head';
import { useContext, useState } from 'react';
import CustomResults from '../components/Results';
import CustomHitsProducts from '../components/ProductsHits';
import { ConfigureIndexProducts } from '../components/ConfigureAlgolia';
import { InstantSearch, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { RefreshContext, UserContext } from '../lib/context';
import CustomSearchBox from '../components/SearchBox';
import CustomNumericMenu from '../components/NumericMenu';
import CustomRefinementList from '../components/RefinementList';
import CustomClearRefinements from '../components/ClearRefinements';
import CustomHierarchicalMenu from '../components/HierarchicalMenu';
import Map from '../components/Map';
import { ChevronDownIcon } from '@heroicons/react/solid';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export default function Home() {
  return (
    <div className="h-full">
      <Head>
        <title>Localz - Sell Your Products</title>
        <meta
          name="description"
          content="Localz is an online marketplace where you can sell your product by location"
        />
      </Head>
      <Content />
    </div>
  );
}

function Content() {
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
      attributes={['categories.lvl0']}
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

function Products() {
  const { user } = useContext(UserContext);
  const [resetSearch, setResetSearch] = useState(false);
  const [type, setType] = useState('');
  return (
    <>
      <Configure
        /*aroundLatLngViaIP={true}
        aroundPrecision={200}
        aroundRadius={20000}*/
        userToken={user?.uid}
        clickAnalytics
        page={0}
      />
      <div className="w-full h-full col-span-5 md:col-span-3 px-5 overflow-y-scroll">
        <CustomSearchBox
          resetSearch={resetSearch}
          setResetSearch={setResetSearch}
        />
        <div className="flex space-x-2 mb-3 overflow-x-scroll">
          <FilterSelector text="price" type={type} setType={setType} />
          <FilterSelector text="seller" type={type} setType={setType} />
          <FilterSelector text="city" type={type} setType={setType} />
          <FilterSelector text="categories" type={type} setType={setType} />
          <CustomClearRefinements setType={setType} />
        </div>
        <NumericMenuFilter type={type} />
        <RefinementList text="seller" attribute="user.name" type={type} />
        <RefinementList text="city" attribute="user.city" type={type} />
        <HierarchicalMenu text="categories" type={type} />
        <ConfigureIndexProducts>
          <CustomResults>
            <CustomHitsProducts />
          </CustomResults>
        </ConfigureIndexProducts>
      </div>
    </>
  );
}
