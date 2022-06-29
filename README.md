This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Algolia Coding Contest 2021 (Second category)

This project was entirely created for Algolia Coding Contest 2021.

The website is called Localz. It's a P2P marketplace where everyone can sell and buy products posted by others.

Note: _This project is configured to run **french businesses**. As a result, **Stripe connected accounts** will be created with `country: 'FR'` params and **Mapbox Geocoding API** will only show FR addresses. Moreover the main currency is **EUR**. For convenience and for the internationality of this competition, English is used as the main language._

This project was made with:

- [Next.js](https://nextjs.org/) and [React](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS](https://tailwindcss.com/)
- [Algolia API](https://www.algolia.com/doc/) (Geo search + Faceting + Filtering + Personalization + Analytics)
- [Stripe API](https://stripe.com/docs) (Connect + Checkout)
- [Firebase API](https://firebase.google.com/docs/guides) (Firestore + Storage + Auth)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [Vercel](https://vercel.com) (for the live demo)

## Fake accounts

| Email       | Password  |
| ----------- | --------- |
| u1@slafe.fr | azerty123 |
| u2@slafe.fr | azerty123 |
| u3@slafe.fr | azerty123 |
| u4@slafe.fr | azerty123 |

## Local setup

If you intent to run the project locally, please create `.env.local` file and complete it:

```bash
# Next public variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="Stripe public key"
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="Mapbox public key"
NEXT_PUBLIC_INDEX_PRODUCTS="Algolia index name"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY="Algolia search key"
NEXT_PUBLIC_ALGOLIA_APP_ID="Algolia app ID"
NEXT_PUBLIC_GOOGLE_API_KEY="Google maps API key"

# Next private variables (for /api)
STRIPE_SECRET_KEY="Stripe secret key"
STRIPE_ENDPOINT_SECRET="Stripe webhook endpoint secret"
STRIPE_ENDPOINT_CONNECT_SECRET="Stripe webhook endpoint secret for connected accounts"

ALGOLIA_SECRET_KEY="Algolia secret key"
ALGOLIA_APP_ID="Algolia app ID"
INDEX_PRODUCTS="Algolia index name"

FIREBASE_BUCKET_NAME="Firebase bucket name"
FIREBASE_PROJECT_ID="Firebase project ID"
FIREBASE_CLIENT_EMAIL="Firebase service account client email"
FIREBASE_PRIVATE_KEY="Firebase service account private key"
```

Don't forget to apply security rules and indexes to your Firebase project:

```bash
firebase deploy --only firestore,storage
```

Then run:

```bash
npm run dev
```

Thanks !!🎉😁

## Author

Clément THIRIET (cthiriet.developer@gmail.com)

## Note

This repo has been improved since the submission deadline of Algolia Coding Contest. To see the version that was submitted for the contest, please refer to https://github.com/ClemDev2000/algolia-cc-priv/commit/de96bc7459a2cda3bf4b2db0f96f3c4a492a0f85.
