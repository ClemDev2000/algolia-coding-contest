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
      const { priceId } = req.body;

      let user: IUser | undefined;
      if (req.headers.token) {
        try {
          const { uid } = await auth.verifyIdToken(
            req.headers.token as string,
            true
          );
          user = (await firestore.doc(`users/${uid}`).get()).data() as IUser;
        } catch (error) {
          return res.status(401).json({ error: error.message });
        }
      }

      const price = await stripe.prices.retrieve(priceId);

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        ...(user && { customer: user.stripe.customerId }),
        metadata: {
          buyer: user?.id ?? '',
          seller: price.metadata.uid,
        },
        payment_intent_data: {
          application_fee_amount: Math.ceil(price.unit_amount * 0.05 + 50), // Fees: 5% + 0.5€
          transfer_data: {
            destination: price.metadata.destination,
          },
        },
        shipping_address_collection: {
          allowed_countries: ['FR'],
        },
        success_url: `${req.headers.origin}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}`,
      });

      res.status(200).json({
        sessionId: checkoutSession.id,
      });
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
