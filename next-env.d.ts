/// <reference types="next" />
/// <reference types="next/types/global" />

interface IUser {
  id: string;
  email: string;
  name: string;
  stripe: {
    customerId: string;
    accountId: string;
    transfers: boolean;
  };
  address: string;
  geoloc: [number, number];
  created: number;
}

interface IProduct {
  objectID: string;
  photoUrl: string;
  description: string;
  name: string;
  amount: number;
  currency: string;
  stripe: {
    productId: string;
    priceId: string;
  };
  user: {
    id: string;
    name: string;
  };
  created: number;
  _tags: string[];
  _geoloc: [number, number];
  __queryID?: string;
  __position?: string;
}

interface IOrder {
  id: string;
  product: {
    id: string;
    name: string;
    photoUrl: string;
  };
  created: number;
  amount: number;
  currency: string;
  seller: string;
  buyer: string;
  shipping: Stripe.Checkout.Session.Shipping;
}
