import React, { useContext, useEffect, useState } from 'react';
import AuthCheck from '../components/AuthCheck';
import Loader from '../components/Loader';
import { UserContext } from '../lib/context';
import { firestore, postToJSON } from '../lib/firebase';
import { formatAmountForDisplay } from '../utils/stripe-helpers';

const LIMIT = 15;

function OrderItem({ order }: { order: IOrder }) {
  return (
    <li className="p-3 border-b-2 border-gray-200 space-y-2">
      <h4 className="text-base text-gray-400 font-mono">
        {new Date(order.created * 1000).toLocaleString()}
      </h4>
      <h1 className="text-gray-800 font-semibold text-xl">
        {order.product.name}
      </h1>
      <h3 className="text-gray-600 font-semibold text-lg">
        {formatAmountForDisplay(order.amount / 100, order.currency)}{' '}
        <span className="text-base text-gray-500">
          (fees: {formatAmountForDisplay(order.fees / 100, order.currency)})
        </span>
      </h3>
      <pre className="font-mono uppercase">
        {order.shipping.name}
        {'\n'}
        {order.shipping.address.line1}, {order.shipping.address.city}
        {'\n'}
        {order.shipping.address.line2 || ''}
        {order.shipping.address.line2 && '\n'}
        {order.shipping.address.postal_code || ''},{' '}
        {order.shipping.address.country}
        {'\n'}
      </pre>
    </li>
  );
}

function Column({
  title,
  emptyMessage,
  objects,
  objectsEnd,
  setObjects,
  setObjectsEnd,
}) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  // Get next page in pagination query
  const getMoreOrders = async (
    type: string,
    object: any,
    setObject: React.Dispatch<React.SetStateAction<any>>,
    setObjectEnd: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    const last = object[object.length - 1];

    const cursor = last.created;

    const query = firestore
      .collection('orders')
      .where(type, '==', user.uid)
      .orderBy('created', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newOrders = (await query.get()).docs.map((doc) => doc.data());

    setObject(object.concat(newOrders));
    setLoading(false);

    if (newOrders.length < LIMIT) {
      setObjectEnd(true);
    }
  };
  return (
    <div className="col-span-1 flex flex-col items-center">
      <h1 className="font-semibold text-gray-800 text-xl mb-10">{title}</h1>
      {!objects.length && (
        <div className="flex justify-center text-lg font-semibold text-gray-500">
          {emptyMessage}
        </div>
      )}

      {objects.length !== 0 && (
        <ul>
          {objects.map((order: IOrder) => (
            <OrderItem order={order} key={order.id} />
          ))}
        </ul>
      )}

      {!loading && !objectsEnd && (
        <button
          className="flex mx-auto mt-5 mb-20 text-base rounded-md text-gray-500 font-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() =>
            getMoreOrders('seller', objects, setObjects, setObjectsEnd)
          }
        >
          Load more
        </button>
      )}

      <Loader show={loading} />
    </div>
  );
}

export default function Orders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [ordersEnd, setOrdersEnd] = useState(false);
  const [purchasesEnd, setPurchasesEnd] = useState(false);

  const getFirestore = async (
    type: string,
    setObject: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const ordersQuery = firestore
      .collection('orders')
      .where(type, '==', user?.uid)
      .orderBy('created', 'desc')
      .limit(LIMIT);

    const ordersDoc = (await ordersQuery.get()).docs.map(postToJSON);
    setObject(ordersDoc);
  };

  useEffect(() => {
    if (user) {
      getFirestore('seller', setOrders);
      getFirestore('buyer', setPurchases);
    }
  }, []);

  useEffect(() => {
    if (orders.length < LIMIT) setOrdersEnd(true);
    if (purchases.length < LIMIT) setPurchasesEnd(true);
  }, [orders, purchases]);

  return (
    <AuthCheck>
      <div className="max-w-4xl mx-auto mt-16 pb-16 grid grid-cols-2">
        <Column
          title="My purchases (bought)"
          emptyMessage="No purchases to show"
          objects={purchases}
          objectsEnd={purchasesEnd}
          setObjects={setPurchases}
          setObjectsEnd={setPurchasesEnd}
        />

        <Column
          title="My orders (sold)"
          emptyMessage="No orders to show"
          objects={orders}
          objectsEnd={ordersEnd}
          setObjects={setOrders}
          setObjectsEnd={setOrdersEnd}
        />
      </div>
    </AuthCheck>
  );
}
