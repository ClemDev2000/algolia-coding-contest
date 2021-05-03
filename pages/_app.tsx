import Head from 'next/head';
import Navbar from '../components/Navbar';
import { RefreshContext, UserContext } from '../lib/context';
import { useRefreshAlgolia, useUserData } from '../lib/hooks';
import '../styles/globals.css';
import aa from 'search-insights';

aa('init', {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
});

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const refreshData = useRefreshAlgolia();
  return (
    <RefreshContext.Provider value={refreshData}>
      <UserContext.Provider value={userData}>
        <Head>
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/reset-min.css"
            integrity="sha256-t2ATOGCtAIZNnzER679jwcFcKYfLlw01gli6F6oszk8="
            crossOrigin="anonymous"
          />
        </Head>
        <div className="min-h-screen">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </UserContext.Provider>
    </RefreshContext.Provider>
  );
}

export default MyApp;
