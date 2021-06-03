import Stripe from 'stripe';

export const deleteProduct = async (
  firestore: FirebaseFirestore.Firestore,
  getStoragePathFromUrl: (url?: string) => string,
  indexProducts: any,
  storage: any,
  bucketName: string,
  stripe: Stripe,
  userId: string,
  id: string | string[]
) => {
  const doc = await firestore.doc(`users/${userId}/products/${id}`).get();
  const product = doc.data() as IProduct;

  const storagePath = getStoragePathFromUrl(product.photoUrl);

  const promises = [];

  promises.push(
    stripe.products.update(product.stripe.productId, {
      active: false,
    })
  );
  promises.push(
    stripe.prices.update(product.stripe.priceId, {
      active: false,
    })
  );
  promises.push(indexProducts.deleteObject(product.objectID));
  promises.push(firestore.doc(`users/${userId}/products/${id}`).delete());
  promises.push(storage.bucket(bucketName).file(storagePath).delete());

  await Promise.all(promises);
};
