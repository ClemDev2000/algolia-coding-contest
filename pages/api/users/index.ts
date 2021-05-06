import { NextApiRequest, NextApiResponse } from 'next';

import { authentication, now } from '../../../utils/api-helpers';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
});
import * as admin from 'firebase-admin';
import * as firebaseTools from 'firebase-tools';

const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID!;
const FIREBASE_TOKEN: string = process.env.FIREBASE_TOKEN!;
const bucketName: string = process.env.FIREBASE_BUCKET_NAME!;

import algoliasearch from 'algoliasearch';
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_SECRET_KEY!
);
const indexProducts = client.initIndex(process.env.INDEX_PRODUCTS!);

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
const storage = admin.storage();
const auth = admin.auth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        address,
        geoloc,
        city,
        postcode,
        line1,
        region,
      } = req.body;
      const name = `${firstName} ${lastName}`;
      const userObject = await auth.createUser({
        email,
        emailVerified: false,
        password,
        displayName: name,
      });
      const uid = userObject.uid;

      const customerPromise = stripe.customers.create({
        email,
        name,
        metadata: {
          uid,
        },
      });

      const accountPromise = stripe.accounts.create({
        type: 'express',
        country: 'FR',
        email,
        business_type: 'individual',
        individual: {
          email,
          first_name: firstName,
          last_name: lastName,
          address: {
            city,
            line1,
            country: 'FR',
            postal_code: postcode,
            ...(region && { state: region }),
          },
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          mcc: '5399',
        },
        metadata: {
          uid,
        },
      });

      const [customer, account] = await Promise.all([
        customerPromise,
        accountPromise,
      ]);

      const user: IUser = {
        id: uid,
        email,
        name,
        address,
        geoloc,
        city,
        stripe: {
          customerId: customer.id,
          accountId: account.id,
          transfers: account.capabilities.transfers === 'active',
        },
        created: now(),
      };
      await firestore.doc(`users/${user.id}`).set(user);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { user, error } = await authentication(req, auth, firestore);
      if (error) return res.status(401).json({ error });

      // Check if the account has a zero balance before deleting the rest of the data.
      await stripe.accounts.del(user.stripe.accountId);

      const promises = [];

      const productsRef = firestore.collection(`users/${user.id}/products`);
      const snapshot = await productsRef.get();
      snapshot.forEach((doc) => {
        const product = doc.data() as IProduct;
        promises.push(
          stripe.products.update(product.stripe.productId, { active: false })
        );
        promises.push(
          stripe.prices.update(product.stripe.priceId, { active: false })
        );
      });

      promises.push(stripe.customers.del(user.stripe.customerId));
      promises.push(
        indexProducts.deleteBy({
          filters: `user.id:${user.id}`,
        })
      );
      promises.push(auth.deleteUser(user.id));
      promises.push(
        storage.bucket(bucketName).deleteFiles({
          prefix: `users/${user.id}`,
        })
      );
      promises.push(
        firebaseTools.firestore.delete(`users/${user.id}`, {
          project: FIREBASE_PROJECT_ID,
          recursive: true,
          yes: true,
          token: FIREBASE_TOKEN,
        })
      );

      await Promise.all(promises);
      res.status(200).json({
        id: user.id,
        delete: true,
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST,DELETE');
    res.status(405).end('Method Not Allowed');
  }
}
