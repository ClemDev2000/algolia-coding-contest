import { Dialog, Transition } from '@headlessui/react';
import { PhotographIcon } from '@heroicons/react/outline';
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
import { Categories } from './Categories';

export default function ProductModal({
  open,
  setOpen,
  product,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product?: IProduct;
}) {
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
  const [category, setCategory] = useState(product?.categories.lvl0 ?? '');

  useEffect(() => {
    if (product && open === true) {
      setAmount(product.amount);
      setName(product.name);
      setDescription(product.description);
      setCurrentPhoto(product.photoUrl);
      setCategory(product.categories.lvl0);
      setPhoto(null);
    }
  }, [open]);

  useEffect(() => {
    if (photo) setPhotoUrl(URL.createObjectURL(photo));
    else setPhotoUrl('');
  }, [photo]);

  function reset() {
    setAmount('');
    setName('');
    setDescription('');
    setPhotoUrl('');
    setPhoto(null);
    setCurrentPhoto('');
    setCategory('');
  }

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
          categorylvl0: category,
          photoUrl: await handleUploadPhotos(photo, user?.uid),
        },
        {
          token: await user.getIdToken(),
        }
      );
      setLoading(false);
      setTimeout(() => {
        setRefresh(true);
      }, 2000);
      setOpen(false);
      reset();
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
          ...(category &&
            category !== product.categories.lvl0 && { categorylvl0: category }),
        },
        {
          token: await user.getIdToken(),
        }
      );
      setLoading(false);
      setTimeout(() => {
        setRefresh(true);
      }, 2000);
      reset();
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
      setTimeout(() => {
        setRefresh(true);
      }, 2000);
      reset();
      setOpen(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  function closeModal() {
    setOpen(false);
    reset();
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
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
            <div className="inline-block w-full max-w-lg py-12 px-6 md:p-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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
                <div className="mb-3">
                  <input
                    ref={fileRef}
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.item(0))}
                  />
                  {photo || product ? (
                    <div
                      className="my-5 rounded-xl border border-gray-200 h-64 w-64 mx-auto bg-cover cursor-pointer bg-center"
                      style={{
                        backgroundImage: `url(${
                          photo ? photoUrl : currentPhoto
                        })`,
                      }}
                      onClick={() => fileRef?.current?.click()}
                    />
                  ) : (
                    <div
                      className="my-5 rounded-xl bg-white border border-gray-200 h-64 w-64 mx-auto cursor-pointer flex items-center justify-center"
                      onClick={() => fileRef?.current?.click()}
                    >
                      <PhotographIcon className="h-14 w-14 text-gray-300" />
                    </div>
                  )}
                </div>
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
                <Categories category={category} setCategory={setCategory} />
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
