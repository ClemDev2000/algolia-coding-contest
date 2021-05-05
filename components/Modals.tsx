import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export function Modal({
  open,
  closeModal,
  title,
  children,
  onSubmit,
}: {
  open: boolean;
  closeModal: any;
  title: string;
  children: React.ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
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
                {title}
              </Dialog.Title>

              <form className="mt-2 space-y-4" onSubmit={onSubmit}>
                {children}
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export function ModalField({
  label,
  id,
  name,
  type,
  autoComplete,
  required,
  value,
  setValue,
  placeholder,
  disabled,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md disabled:opacity-50"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        disabled={disabled}
      />
    </div>
  );
}

function Spinner() {
  return (
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
  );
}

export function ModalFooter({
  loading,
  mainButtonText,
  closeModal,
  showDeleteButton,
  onClickDelete,
  deleteButtonText,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="flex pt-5">
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
      >
        {loading && <Spinner />}
        {mainButtonText}
      </button>
      <button
        type="button"
        className="inline-flex ml-2 justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
        onClick={closeModal}
      >
        Cancel
      </button>
      {showDeleteButton && (
        <button
          type="button"
          disabled={loading}
          className="inline-flex ml-auto justify-center pl-4 py-2 text-sm font-medium text-red-500 bg-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
          onClick={confirmDelete ? onClickDelete : () => setConfirmDelete(true)}
        >
          {confirmDelete ? 'Confirm' : deleteButtonText}
        </button>
      )}
    </div>
  );
}
