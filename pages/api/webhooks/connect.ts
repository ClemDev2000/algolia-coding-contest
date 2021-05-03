import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
});
import * as admin from 'firebase-admin';

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

const webhookSecret: string = process.env.STRIPE_ENDPOINT_CONNECT_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message.
      console.error(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id);

    try {
      // Handle the event
      switch (event.type) {
        case 'account.updated': {
          const account = event.data.object as Stripe.Account;
          const transfers = account.capabilities?.transfers === 'active';
          const uid = account.metadata?.uid!;

          const docRef = firestore.doc(`users/${uid}`);
          const doc = await docRef.get();
          const user = doc.data() as IUser;

          if (user.stripe.transfers !== transfers) {
            await docRef.update({
              'stripe.transfers': transfers,
            });
          }

          break;
        }
        default: {
          // Unhandled event type
          console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }
      }

      // Return a response to acknowledge receipt of the event.
      res.json({ received: true });
      return;
    } catch (err) {
      // On error, log and return the error message.
      console.error(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(webhookHandler as any);
