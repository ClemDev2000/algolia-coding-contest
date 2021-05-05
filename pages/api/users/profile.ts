import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
});
import * as admin from 'firebase-admin';
import { authentication } from '../../../utils/api-helpers';

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
      const { email, name } = req.body;

      const { user, error } = await authentication(req, auth, firestore);
      if (error) return res.status(401).json({ error });

      const promises = [];

      if (email || name) {
        promises.push(
          auth.updateUser(user.id, {
            ...(name && { displayName: name }),
            ...(email && { email, emailVerified: false }),
          })
        );
        promises.push(
          stripe.customers.update(user.stripe.customerId, {
            ...(name && { name }),
            ...(email && { email }),
          })
        );
      }

      promises.push(
        firestore.doc(`users/${user.id}`).update({
          ...(name && { name }),
          ...(email && { email }),
        })
      );

      await Promise.all(promises);

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
