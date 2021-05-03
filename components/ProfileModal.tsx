import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UserContext } from '../lib/context';
import { auth, authCredential } from '../lib/firebase';
import { fetchDeleteJSON, fetchPostJSON } from '../utils/api-helpers';

export default function ProductModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cancelButtonRef = useRef();

  const router = useRouter();

  const { user, userdata } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(userdata?.name ?? '');
  const [email, setEmail] = useState(userdata?.address ?? '');
  const [address, setAddress] = useState(userdata?.address ?? '');

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (
        (name && name !== userdata?.name) ||
        (address && address !== userdata?.address) ||
        (email && email !== userdata?.email)
      ) {
        await fetchPostJSON(
          '/api/users/profile',
          {
            ...(name && name !== userdata?.name && { name }),
            ...(address && address !== userdata?.address && { address }),
            ...(email && email !== userdata?.email && { email }),
          },
          {
            token: await user.getIdToken(),
          }
        );
        if (email) await user.sendEmailVerification();
      }
      if (password && newPassword) {
        const credential = authCredential(user.email, password);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
      }
      setLoading(false);
      closeModal();
    } catch (err) {
      setLoading(false);
      console.error(err.message);
    }
  };

  const handleDeleteProfile: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      await fetchDeleteJSON('/api/users', {
        token: await user.getIdToken(),
      });
      closeModal();
      auth.signOut();
      router.push('/');
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (userdata) {
      setName(userdata.name);
      setEmail(userdata.email);
      setAddress(userdata.address);
    }
  }, [userdata]);

  function closeModal() {
    setOpen(false);
    setPassword('');
    setNewPassword('');
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
                Update my profile
              </Dialog.Title>

              <form className="mt-2 space-y-4" onSubmit={handleUpdateProfile}>
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
                    Email
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="tags"
                    id="tags"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="pt-5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new_password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    Update
                  </button>
                  <button
                    type="button"
                    className="inline-flex ml-2 justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex ml-auto justify-center px-4 py-2 text-sm font-medium text-red-500 bg-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={handleDeleteProfile}
                  >
                    Close my account
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
