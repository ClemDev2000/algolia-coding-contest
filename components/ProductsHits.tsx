import React, { Component, useContext, useState } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { UserContext } from '../lib/context';
import { fetchPostJSON } from '../utils/api-helpers';
import getStripe from '../utils/get-stripejs';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import aa from 'search-insights';
import { PencilIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import Product from './ProductModal';
import Highlight from './algolia/Highlight';

const indexProducts = process.env.NEXT_PUBLIC_INDEX_PRODUCTS;

function Spinner() {
  return (
    <svg
      className="animate-spin ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function HitProducts({ hit }: { hit: IProduct }) {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const buy = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      aa('convertedObjectIDsAfterSearch', {
        ...(user && { userToken: user.uid }),
        index: indexProducts,
        eventName: 'Checkout',
        queryID: hit.__queryID,
        objectIDs: [hit.objectID],
      });

      const stripe = await getStripe();

      const token = user ? await user.getIdToken() : null;
      const response = await fetchPostJSON(
        '/api/checkout_sessions',
        {
          priceId: hit.stripe.priceId,
        },
        {
          ...(token && { token }),
        }
      );
      const { error } = await stripe!.redirectToCheckout({
        sessionId: response.sessionId,
      });
      console.warn(error.message);
    } catch (error) {
      console.warn(error.message);
    }
    setLoading(false);
  };

  return (
    <li className="flex bg-white py-3 h-40 md:h-44 overflow-hidden items-center border-b border-gray-200">
      {/* Photo */}
      <div
        className="bg-cover bg-center border border-opacity-10 border-gray-400 rounded-xl w-28 h-32 md:w-36 flex-shrink-0 md:h-full"
        style={{ backgroundImage: `url(${hit.photoUrl})` }}
      />

      {/* Infos */}
      <div className="flex flex-col h-full w-full px-3 py-3 overflow-x-scroll">
        <h1 className="text-base md:text-lg font-semibold truncate">
          <Highlight attribute="name" hit={hit} />
        </h1>
        <h2 className="text-xs sm:text-sm font-medium truncate text-gray-500">
          <span className="text-gray-400 font-normal">
            par <span className="text-gray-500">{hit.user.name}</span>
          </span>
        </h2>
        <div className="border rounded-full w-1/5 my-2 bg-gray-300" />
        <h3 className="text-sm md:text-base font-normal truncate text-gray-500">
          <Highlight attribute="description" hit={hit} />
        </h3>
        <div className="flex flex-wrap items-center justify-between mt-auto">
          <h1 className="sm:text-sm md:text-lg font-semibold text-gray-500">
            {formatAmountForDisplay(hit.amount, hit.currency)}
          </h1>

          {/* Buttons */}
          {hit.user.id === user?.uid ? (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex bg-red-500 rounded-full p-2 cursor-pointer justify-center border border-transparent text-sm font-medium focus:outline-none"
            >
              <PencilIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </button>
          ) : (
            <button
              onClick={buy}
              className="inline-flex text-white px-3 items-center font-semibold bg-red-500 rounded-full p-2 cursor-pointer justify-center border border-transparent text-sm focus:outline-none"
            >
              {!loading ? (
                <ShoppingBagIcon className="h-5 w-5 text-white mr-1" />
              ) : (
                <Spinner />
              )}
              Buy
            </button>
          )}
        </div>
      </div>
      <Product open={open} setOpen={setOpen} product={hit} />
    </li>
  );
}

class HitsBox extends Component<any> {
  sentinel: any = null;
  observer: any = null;

  onSentinelIntersection: IntersectionObserverCallback = (entries) => {
    const { hasMore, refineNext }: any = this.props;

    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore) {
        refineNext();
      }
    });
  };

  componentDidMount() {
    this.observer = new IntersectionObserver(this.onSentinelIntersection);

    this.observer.observe(this.sentinel);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    const { hits }: any = this.props;

    return (
      <ul id="scrollProducts" className="grid grid-cols-1">
        {hits.map((hit: IProduct) => (
          <HitProducts key={hit.objectID} hit={hit} />
        ))}
        <li ref={(el) => (this.sentinel = el)} />
      </ul>
    );
  }
}

export default connectInfiniteHits(HitsBox);
