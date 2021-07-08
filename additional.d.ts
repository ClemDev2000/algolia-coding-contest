interface IUser {
  id: string;
  email: string;
  name: string;
  stripe: {
    customerId: string;
    accountId: string;
    transfers: boolean;
  };
  city: string;
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
    city: string;
  };
  created: number;
  categories: {
    lvl0: string;
    lvl1?: string;
  };
  promote?: string;
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
  fees: number;
  created: number;
  amount: number;
  currency: string;
  seller: string;
  buyer: string;
  shipping: any;
}
