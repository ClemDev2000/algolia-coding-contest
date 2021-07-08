import { Fragment, useContext, useRef, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  MenuIcon,
  XIcon,
  UserIcon,
  CubeIcon,
  LibraryIcon,
  UserCircleIcon,
} from '@heroicons/react/outline';
import { UserContext } from '../lib/context';
import Link from 'next/link';
import ProductModal from './ProductModal';
import ProfileModal from './ProfileModal';
import { useRouter } from 'next/router';
import Logo from './Logo';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function MobileMenuButton({ buttonRef, open }) {
  return (
    <div className="-mr-2 flex md:hidden">
      {/* Mobile menu button */}
      <Disclosure.Button
        ref={buttonRef}
        className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-400 focus:ring-white"
      >
        <span className="sr-only">Open main menu</span>
        {open ? (
          <XIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <MenuIcon className="block h-6 w-6" aria-hidden="true" />
        )}
      </Disclosure.Button>
    </div>
  );
}

function MobileMenu({
  navigation,
  sellProduct,
  buttonRef,
  profile,
  setOpenProfile,
}) {
  const { user, userdata } = useContext(UserContext);
  const router = useRouter();
  return (
    <Disclosure.Panel className="md:hidden bg-white">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 z-10">
        {navigation.map((item) =>
          router.pathname === item.path ? (
            <Fragment key={item.name}>
              <a
                href={item.path}
                className="bg-red-500 text-white block px-3 py-2 rounded-full text-base font-medium"
              >
                {item.name}
              </a>
            </Fragment>
          ) : (
            <Link href={item.path} key={item.name}>
              <a
                onClick={() => buttonRef.current.click()}
                className="text-gray-400 hover:bg-red-400 hover:text-white block px-3 py-2 rounded-full text-base font-medium"
              >
                {item.name}
              </a>
            </Link>
          )
        )}
      </div>
      <div className="pt-4 pb-3 border-t-2 border-gray-200">
        {user ? (
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 rounded-full bg-gray-100 p-1 text-red-500" />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium leading-none text-gray-600">
                {user.displayName}
              </div>
              <div className="text-sm font-normal leading-none text-gray-400">
                {user.email}
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-3 px-2 space-y-1">
          {user && (
            <a
              href="#"
              onClick={() => {
                sellProduct();
                buttonRef.current.click();
              }}
              className="block px-3 py-2 rounded-full text-base font-medium text-gray-400 hover:text-white hover:bg-red-300 cursor-pointer"
            >
              Sell a product
            </a>
          )}
          {user && userdata?.stripe.transfers && (
            <Link href="/reauth">
              <a
                onClick={() => buttonRef.current.click()}
                className="block px-3 py-2 rounded-full text-base font-medium text-gray-400 hover:text-white hover:bg-red-300"
              >
                Open bank account
              </a>
            </Link>
          )}
          {user && (
            <a
              href="#"
              onClick={() => {
                setOpenProfile(true);
                buttonRef.current.click();
              }}
              className="block px-3 py-2 rounded-full text-base font-medium text-gray-400 hover:text-white hover:bg-red-300 cursor-pointer"
            >
              Profile
            </a>
          )}
          {profile.map((item) => (
            <Link href={item.path} key={item.name}>
              <a
                onClick={() => buttonRef.current.click()}
                className="block px-3 py-2 rounded-full text-base font-medium text-gray-400 hover:text-white hover:bg-red-300"
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Disclosure.Panel>
  );
}

function DesktopMenu({ sellProduct, profile, setOpenProfile }) {
  const { user, userdata } = useContext(UserContext);
  return (
    <div className="hidden md:block">
      <div className="ml-4 flex items-center md:ml-6">
        {user && (
          <div className="ml-6 relative">
            <button
              onClick={sellProduct}
              className="bg-red-500 rounded-full flex items-center text-sm focus:outline-none px-4 py-2"
            >
              <span className="sr-only">Create a new product</span>
              <CubeIcon className="h-5 w-5 text-white mr-2" />
              <span className="text-white text-sm font-semibold">
                Sell a product
              </span>
            </button>
          </div>
        )}
        {user && userdata?.stripe.transfers && (
          <Link href="/reauth" passHref>
            <div className="ml-6 relative">
              <div className="max-w-xs bg-red-500 flex items-center text-sm focus:outline-none">
                <span className="sr-only">Open account</span>
                <LibraryIcon className="h-8 w-8 bg-white text-gray-500 hover:text-red-500 cursor-pointer" />
              </div>
            </div>
          </Link>
        )}

        {/* Profile dropdown */}
        <Menu as="div" className="ml-6 relative z-10">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="max-w-xs bg-red-500 rounded-full flex items-center text-sm focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-8 w-8 bg-white text-gray-500 hover:text-red-500" />
                </Menu.Button>
              </div>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {user && (
                    <Menu.Item key="profile">
                      <span
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                        onClick={() => setOpenProfile(true)}
                      >
                        Profile
                      </span>
                    </Menu.Item>
                  )}
                  {profile.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link href={item.path}>
                          <a
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            {item.name}
                          </a>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}

function DesktopNavigation({ navigation }) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {navigation.map((item) =>
          router.pathname === item.path ? (
            <Fragment key={item.name}>
              <Link href={item.path}>
                <a className="text-red-500 px-3 py-2 rounded-full text-base font-bold">
                  {item.name}
                </a>
              </Link>
            </Fragment>
          ) : (
            <Link href={item.path} key={item.name}>
              <a className="text-gray-500 hover:text-red-400 px-3 py-2 rounded-full text-base font-medium">
                {item.name}
              </a>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, userdata } = useContext(UserContext);
  const buttonRef = useRef<any>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  function sellProduct() {
    if (!userdata?.stripe.transfers) {
      router.push('/reauth');
    } else {
      setOpen(true);
    }
  }

  const navigation = user
    ? [
        {
          name: 'Marketplace',
          path: '/',
        },
        {
          name: 'Orders',
          path: '/orders',
        },
      ]
    : [
        {
          name: 'Marketplace',
          path: '/',
        },
      ];

  const profile = user
    ? [
        {
          name: 'Sign Out',
          path: '/logout',
        },
      ]
    : [
        {
          name: 'Sign In',
          path: '/login',
        },
      ];

  return (
    <>
      <Disclosure as="nav" className="shadow-md z-10 fixed w-full bg-white">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <a>
                        <Logo className="h-8 w-8" />
                      </a>
                    </Link>
                  </div>
                  <DesktopNavigation navigation={navigation} />
                </div>
                <DesktopMenu
                  sellProduct={sellProduct}
                  profile={profile}
                  setOpenProfile={setOpenProfile}
                />
                <MobileMenuButton buttonRef={buttonRef} open={open} />
              </div>
            </div>

            <MobileMenu
              navigation={navigation}
              sellProduct={sellProduct}
              buttonRef={buttonRef}
              profile={profile}
              setOpenProfile={setOpenProfile}
            />
          </>
        )}
      </Disclosure>
      <ProductModal open={open} setOpen={setOpen} />
      <ProfileModal open={openProfile} setOpen={setOpenProfile} />
    </>
  );
}
