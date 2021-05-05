import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
});

import { authentication, now } from '../../../utils/api-helpers';

import algoliasearch from 'algoliasearch';
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_SECRET_KEY!
);
const indexProducts = client.initIndex(process.env.INDEX_PRODUCTS!);

import * as admin from 'firebase-admin';
import { formatAmountForStripe } from '../../../utils/stripe-helpers';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();
const auth = admin.auth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { name, description, amount, photoUrl, categorylvl0 } = req.body;

      const { user, error } = await authentication(req, auth, firestore);
      if (error) return res.status(401).json({ error });

      const product = await stripe.products.create({
        name,
        description,
        images: [photoUrl],
        metadata: {
          uid: user.id,
        },
      });

      const price = await stripe.prices.create({
        currency: 'eur',
        product: product.id,
        unit_amount: formatAmountForStripe(parseFloat(amount), 'eur'),
        metadata: {
          uid: user.id,
          destination: user.stripe.accountId,
        },
      });

      const algoliaProduct: IProduct = {
        objectID: product.id,
        photoUrl,
        name,
        description,
        amount: parseFloat(amount),
        currency: 'eur',
        created: now(),
        stripe: {
          productId: product.id,
          priceId: price.id,
        },
        user: {
          name: user.name,
          id: user.id,
          city: user.city,
        },
        categories: {
          lvl0: categorylvl0,
        },
        _geoloc: user.geoloc,
      };

      const promises = [];
      promises.push(indexProducts.saveObject(algoliaProduct));
      promises.push(
        firestore
          .doc(`users/${user.id}/products/${product.id}`)
          .set(algoliaProduct)
      );
      await Promise.all(promises);

      res.status(200).json(algoliaProduct);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
