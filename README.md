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

## Local setup

If you intent to run the project locally, copy `.env.example` as `.env.local` and fill the variables with your own credentials:

```sh
cp .env.example .env.local
```

Don't forget to apply security rules and indexes to your Firebase project:

```bash
firebase deploy --only firestore,storage
```

Install the dependencies and run the project:

```bash
npm install
npm run dev
```

## Test Stripe Webhooks locally

```sh
stripe listen \
  --forward-to=http://localhost:3000/api/webhooks \
  --forward-connect-to=http://localhost:3000/api/webhooks/connect \
  --events=checkout.session.completed,account.updated
```

## Author

Clément Thiriet (cthiriet.developer@gmail.com)
