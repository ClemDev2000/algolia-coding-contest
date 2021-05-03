import { Dialog, Transition } from '@headlessui/react';
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { RefreshContext, UserContext } from '../lib/context';
import { fetchDeleteJSON, fetchPostJSON } from '../utils/api-helpers';
import { handleUploadPhotos } from '../utils/storage';

export default function ProductModal({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product?: IProduct;
}) {
  const cancelButtonRef = useRef();

  const { user } = useContext(UserContext);
  const { setRefresh } = useContext(RefreshContext);

  const [loading, setLoading] = useState(false);

  const [currentPhoto, setCurrentPhoto] = useState(product?.photoUrl ?? '');
  const [photo, setPhoto] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(product?.description ?? '');
  const [name, setName] = useState(product?.name ?? '');
  const [amount, setAmount] = useState(product?.amount ?? '');
  const [tags, setTags] = useState(product?._tags ?? '');

  useEffect(() => {
    if (product) {
      setAmount(product.amount);
      setName(product.name);
      setDescription(product.description);
      setCurrentPhoto(product.photoUrl);
      setPhoto(null);
    }
  }, [product]);

  useEffect(() => {
    if (photo) setPhotoUrl(URL.createObjectURL(photo));
    else setPhotoUrl('');
  }, [photo]);

  const handleCreateProduct: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      await fetchPostJSON(
        '/api/products',
        {
          name,
          description,
          amount,
          tags,
          photoUrl: await handleUploadPhotos(photo, user?.uid),
        },
        {
          token: await user.getIdToken(),
        }
      );
      setLoading(false);
      setRefresh(true);
      setOpen(false);
    } catch (err) {
      setLoading(false);
      console.error(err.message);
    }
  };

  const handleUpdateProduct: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      await fetchPostJSON(
        `/api/products/${product.objectID}`,
        {
          ...(name && name !== product.name && { name }),
          ...(description &&
            description !== product.description && { description }),
          ...(photo && {
            photoUrl: await handleUploadPhotos(photo, user?.uid),
          }),
          ...(tags && tags !== product._tags && { tags }),
        },
        {
          token: await user.getIdToken(),
        }
      );
      setLoading(false);
      setRefresh(true);
      setOpen(false);
    } catch (err) {
      setLoading(false);
      console.error(err.message);
    }
  };

  const handleDeleteProduct: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      await fetchDeleteJSON(`/api/products/${product.objectID}`, {
        token: await user.getIdToken(),
      });
      setRefresh(true);
      setOpen(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  function closeModal() {
    setOpen(false);
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        static
        open={open}
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-lg p-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {product ? 'Edit your product' : 'Create a new product'}
              </Dialog.Title>

              <form
                className="mt-2 space-y-4"
                onSubmit={product ? handleUpdateProduct : handleCreateProduct}
              >
                <input
                  ref={fileRef}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.item(0))}
                />
                {photo || product ? (
                  <div
                    className="my-5 rounded-lg shadow-xl h-80 w-80 mx-auto bg-cover cursor-pointer bg-center"
                    style={{
                      backgroundImage: `url(${
                        photo ? photoUrl : currentPhoto
                      })`,
                    }}
                    onClick={() => fileRef?.current?.click()}
                  />
                ) : (
                  <div
                    className="my-5 rounded-lg bg-white shadow-xl h-80 w-80 mx-auto cursor-pointer flex items-center justify-center"
                    onClick={() => fileRef?.current?.click()}
                  >
                    <svg
                      className="h-14 w-14 text-gray-300 fill-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.64124 22H16.3582C19.7322 22 22.0002 19.632 22.0002 16.107L21.9992 14.692C21.9992 14.48 21.9032 14.28 21.7372 14.147C21.5181 13.9723 21.2931 13.777 21.0622 13.5768L21.0532 13.569L21.0464 13.5631C19.8116 12.4961 18.2767 11.1698 16.3482 11.619C14.9507 11.9434 14.2338 13.0013 13.6016 13.9341L13.5982 13.939L13.597 13.9409C13.1774 14.5612 12.7817 15.1463 12.2292 15.487C11.6862 15.825 11.0402 15.584 10.1162 15.18L9.95924 15.11C8.27324 14.376 6.89024 14.587 5.72924 15.757C5.45824 16.03 5.46024 16.473 5.73324 16.744C6.00624 17.017 6.44824 17.013 6.71924 16.74C7.46624 15.987 8.24424 15.885 9.40224 16.391L9.55624 16.458L9.55777 16.4587C10.4876 16.8646 11.7589 17.4196 12.9632 16.674C13.7702 16.174 14.2702 15.436 14.7532 14.722L14.7536 14.7215C15.3135 13.8947 15.7974 13.18 16.6642 12.979C17.9046 12.6922 19.039 13.6729 20.1384 14.6234L20.1402 14.625C20.1564 14.639 20.1725 14.6529 20.1886 14.6669C20.3291 14.7887 20.4679 14.9089 20.6042 15.022V16.107C20.6042 18.84 18.9372 20.604 16.3582 20.604H7.64124C5.06224 20.604 3.39524 18.84 3.39524 16.107V7.893C3.39524 5.16 5.06224 3.396 7.64124 3.396H16.3592C18.9382 3.396 20.6042 5.16 20.6042 7.893V10.263C20.6042 10.648 20.9172 10.961 21.3022 10.961C21.6872 10.961 22.0002 10.648 22.0002 10.263V7.893C22.0002 4.368 19.7332 2 16.3592 2H7.64124C4.26724 2 2.00024 4.368 2.00024 7.893V16.107C2.00024 19.632 4.26724 22 7.64124 22ZM8.85384 11.3391C7.44284 11.3391 6.29584 10.1911 6.29584 8.7801C6.29584 7.3701 7.44284 6.2221 8.85384 6.2221C10.2648 6.2221 11.4118 7.3701 11.4118 8.7801C11.4118 10.1911 10.2648 11.3391 8.85384 11.3391ZM8.85384 7.6181C8.21284 7.6181 7.69084 8.1391 7.69084 8.7801C7.69084 9.4221 8.21284 9.9431 8.85384 9.9431C9.49584 9.9431 10.0168 9.4221 10.0168 8.7801C10.0168 8.1391 9.49584 7.6181 8.85384 7.6181Z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      required
                      disabled={!!product}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md disabled:opacity-50"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <label htmlFor="currency" className="sr-only">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        disabled={!!product}
                        className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md disabled:opacity-50"
                      >
                        <option>EUR</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    required
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex pt-5">
                  <button
                    type="submit"
                    className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  >
                    {loading && (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {!!product ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex ml-2 justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  {product && (
                    <button
                      type="button"
                      className="inline-flex ml-auto justify-center px-4 py-2 text-sm font-medium text-red-500 bg-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                      onClick={handleDeleteProduct}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
