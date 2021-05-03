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
import Map from '../components/Map';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Localz</title>
        <meta name="description" content="Sell Next Your Home" />
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
      <main className="grid grid-cols-5">
        <Products />
        <Map />
      </main>
    </InstantSearch>
  );
}

function Products() {
  const { user } = useContext(UserContext);
  const [resetSearch, setResetSearch] = useState(false);
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
      <div className="w-full min-h-screen col-span-3 px-5">
        <CustomSearchBox
          resetSearch={resetSearch}
          setResetSearch={setResetSearch}
        />
        <CustomNumericMenu
          attribute="amount"
          items={[
            { label: '<= €10', end: 10 },
            { label: '€10 - €100', start: 10, end: 100 },
            { label: '€100 - €500', start: 100, end: 500 },
            { label: '>= €500', start: 500 },
          ]}
        />
        <ConfigureIndexProducts>
          <CustomResults>
            <CustomHitsProducts />
          </CustomResults>
        </ConfigureIndexProducts>
      </div>
    </>
  );
}
