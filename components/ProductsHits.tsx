import React, { Component, useContext, useState } from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { UserContext } from '../lib/context';
import { fetchPostJSON } from '../utils/api-helpers';
import getStripe from '../utils/get-stripejs';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import aa from 'search-insights';
import { PencilIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import Product from './ProductModal';

const indexProducts = process.env.NEXT_PUBLIC_INDEX_PRODUCTS;

const HitProducts: React.FC<{
  hit: IProduct;
}> = ({ hit }) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const buy = async () => {
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
  };

  return (
    <li className="flex bg-white py-3 h-44 overflow-hidden border-b border-gray-200">
      <div
        className="bg-cover bg-center border border-opacity-10 border-gray-400 rounded-xl w-36 flex-shrink-0 h-full"
        style={{ backgroundImage: `url(${hit.photoUrl})` }}
      />
      <div className="flex flex-col h-full w-full px-3 py-3 overflow-x-scroll">
        <span className="text-lg font-semibold truncate">{hit.name}</span>
        <h2 className="text-xs sm:text-sm font-medium truncate text-gray-500">
          <span className="text-gray-400 font-normal">
            par <span className="text-gray-500">{hit.user.name}</span>
          </span>
        </h2>
        <div className="border rounded-full w-1/5 my-2 bg-gray-300" />
        <h3 className="text-base font-normal truncate text-gray-500">
          {hit.description}
        </h3>
        <div className="flex flex-wrap items-center justify-between mt-auto">
          <h1 className="text-lg font-semibold text-gray-500">
            {formatAmountForDisplay(hit.amount, hit.currency)}
          </h1>

          {hit.user.id === user?.uid ? (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex bg-red-500 rounded-full p-2 cursor-pointer justify-center border border-transparent text-sm font-medium focus:outline-none"
            >
              <PencilIcon className="h-5 w-5 text-white" />
            </button>
          ) : (
            <button
              onClick={buy}
              className="inline-flex text-white px-3 items-center font-semibold bg-red-500 rounded-full p-2 cursor-pointer justify-center border border-transparent text-sm focus:outline-none"
            >
              <ShoppingBagIcon className="h-5 w-5 text-white mr-1" />
              Buy
            </button>
          )}
        </div>
      </div>
      <Product open={open} setOpen={setOpen} product={hit} />
    </li>
  );
};

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
