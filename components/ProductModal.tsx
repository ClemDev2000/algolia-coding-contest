import { PhotographIcon } from '@heroicons/react/outline';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { RefreshContext, UserContext } from '../lib/context';
import { fetchDeleteJSON, fetchPostJSON } from '../utils/api-helpers';
import { handleUploadPhotos } from '../utils/storage';
import { Categories, SubCategories } from './Categories';
import ErrorMessage from './ErrorMessage';
import { Modal, ModalField, ModalFooter } from './Modals';

function PhotoField({
  fileRef,
  photo,
  setPhoto,
  product,
  photoUrl,
  currentPhoto,
}) {
  return (
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
            backgroundImage: `url(${photo ? photoUrl : currentPhoto})`,
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
  );
}

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
  const [error, setError] = useState('');

  const [currentPhoto, setCurrentPhoto] = useState(product?.photoUrl ?? '');
  const [photo, setPhoto] = useState<any>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState(product?.description ?? '');
  const [name, setName] = useState(product?.name ?? '');
  const [amount, setAmount] = useState(product?.amount ?? '');
  const [category, setCategory] = useState(product?.categories.lvl0 ?? '');
  const [subcategory, setSubcategory] = useState(
    product?.categories.lvl1.split('> ')[1] ?? ''
  );

  useEffect(() => {
    if (category !== product?.categories.lvl0) setSubcategory('');
    else setSubcategory(product?.categories.lvl1.split('> ')[1]);
  }, [category]);

  useEffect(() => {
    if (product && open === true) {
      setAmount(product.amount);
      setName(product.name);
      setDescription(product.description);
      setCurrentPhoto(product.photoUrl);
      setCategory(product.categories.lvl0);
      setSubcategory(product?.categories.lvl1.split('> ')[1]);
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
    setSubcategory('');
  }

  const handleCreateProduct: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    setLoading(true);
    try {
      e.preventDefault();
      await fetchPostJSON(
        '/api/products',
        {
          name,
          description,
          amount,
          categorylvl0: category,
          categorylvl1: subcategory,
          photoUrl: await handleUploadPhotos(photo, user?.uid),
        },
        {
          token: await user.getIdToken(),
        }
      );
      setTimeout(() => {
        setRefresh(true);
      }, 3000);
      setOpen(false);
      reset();
    } catch (err) {
      setError(err.message);
      console.warn(err.message);
    }
    setLoading(false);
  };

  const handleUpdateProduct: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    setLoading(true);
    try {
      e.preventDefault();
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
            subcategory &&
            (category !== product.categories.lvl0 ||
              subcategory !== product.categories.lvl1.split('> ')[1]) && {
              categorylvl0: category,
              categorylvl1: subcategory,
            }),
        },
        {
          token: await user.getIdToken(),
        }
      );
      setTimeout(() => {
        setRefresh(true);
      }, 3000);
      reset();
      setOpen(false);
    } catch (err) {
      setError(err.message);
      console.warn(err.message);
    }
    setLoading(false);
  };

  const handleDeleteProduct: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    setLoading(true);
    try {
      e.preventDefault();
      await fetchDeleteJSON(`/api/products/${product.objectID}`, {
        token: await user.getIdToken(),
      });
      setTimeout(() => {
        setRefresh(true);
      }, 3000);
      reset();
      setOpen(false);
    } catch (err) {
      setError(err.message);
      console.warn(err.message);
    }
    setLoading(false);
  };

  function closeModal() {
    setOpen(false);
    reset();
  }

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      title={product ? 'Edit your product' : 'Create a new product'}
      onSubmit={product ? handleUpdateProduct : handleCreateProduct}
    >
      <PhotoField
        fileRef={fileRef}
        photo={photo}
        setPhoto={setPhoto}
        product={product}
        photoUrl={photoUrl}
        currentPhoto={currentPhoto}
      />
      <ModalField
        label="Name"
        id="name"
        name="name"
        type="text"
        required
        value={name}
        setValue={setName}
      />
      <ModalField
        label="Description"
        id="description"
        name="description"
        type="text"
        required
        value={description}
        setValue={setDescription}
      />
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
            type="number"
            name="price"
            id="price"
            required
            disabled={!!product}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md disabled:opacity-50"
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
              className="focus:ring-red-500 focus:border-red-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md disabled:opacity-50"
            >
              <option>EUR</option>
            </select>
          </div>
        </div>
      </div>
      <Categories category={category} setCategory={setCategory} />
      {category && (
        <SubCategories
          subcategory={subcategory}
          setSubcategory={setSubcategory}
          type={category}
        />
      )}
      <ErrorMessage message={error} />
      <ModalFooter
        loading={loading}
        mainButtonText={product ? 'Update' : 'Create'}
        closeModal={closeModal}
        showDeleteButton={product}
        onClickDelete={handleDeleteProduct}
        deleteButtonText="Delete"
      />
    </Modal>
  );
}
