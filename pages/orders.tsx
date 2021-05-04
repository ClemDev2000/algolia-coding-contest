import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import AuthCheck from '../components/AuthCheck';
import Loader from '../components/Loader';
import { UserContext } from '../lib/context';
import { firestore, postToJSON } from '../lib/firebase';

const LIMIT = 15;

export default function Orders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ordersEnd, setOrdersEnd] = useState(false);

  const getOrders = async () => {
    const ordersQuery = firestore
      .collection('orders')
      .where('seller', '==', user?.uid)
      .orderBy('created', 'desc')
      .limit(LIMIT);

    const ordersDoc = (await ordersQuery.get()).docs.map(postToJSON);
    setOrders(ordersDoc);
  };

  useEffect(() => {
    if (user) getOrders();
  }, []);

  useEffect(() => {
    if (orders.length < LIMIT) setOrdersEnd(true);
  }, [orders]);

  // Get next page in pagination query
  const getMoreOrders = async () => {
    setLoading(true);
    const last = orders[orders.length - 1];

    const cursor = last.created;

    const query = firestore
      .collection('orders')
      .where('seller', '==', user.uid)
      .orderBy('created', 'desc')
      .startAfter(cursor)
      .limit(LIMIT);

    const newOrders = (await query.get()).docs.map((doc) => doc.data());

    setOrders(orders.concat(newOrders));
    setLoading(false);

    if (newOrders.length < LIMIT) {
      setOrdersEnd(true);
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen max-w-lg mx-auto mt-16">
        <Head>
          <title>Localz - Orders</title>
          <meta name="description" content="Sell Next Your Home" />
        </Head>

        {!orders.length && (
          <div className="flex justify-center text-lg font-semibold text-gray-500">
            No orders to show
          </div>
        )}

        {orders.map((order: IOrder) => (
          <div>{order.amount}</div>
        ))}

        {!loading && !ordersEnd && (
          <button
            className="flex mx-auto mt-5 mb-20 text-base rounded-md text-gray-500 font-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={getMoreOrders}
          >
            Load more
          </button>
        )}

        <Loader show={loading} />
      </div>
    </AuthCheck>
  );
}
