import { LockClosedIcon } from '@heroicons/react/solid';
import { useCallback, useState } from 'react';
import { auth } from '../lib/firebase';
import Link from 'next/link';
import { fetchPostJSON } from '../utils/api-helpers';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mapbox({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
});

export default function Example() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Address states
  const [address, setAddress] = useState('');
  const [geoloc, setGeoloc] = useState<any>(null);
  const [values, setValues] = useState<any>(null);

  const onChangeAddress = useCallback(async (val: string) => {
    try {
      setAddress(val);
      setGeoloc(null);
      if (val.length > 5) {
        const result = await geocodingClient
          .forwardGeocode({
            query: val,
            mode: 'mapbox.places',
            countries: ['fr'],
            types: ['address'],
            autocomplete: true,
            language: ['fr'],
          })
          .send();
        const match = result.body;
        setValues(match.features);
      } else {
        setValues(null);
      }
      if (!address) setValues(null);
    } catch (err) {}
  }, []);

  const onAddressClick = async (address: string, center: number[]) => {
    setAddress(address);
    setGeoloc({
      lng: center[0],
      lat: center[1],
    });
    setValues(null);
  };

  const handleSignUp: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      await fetchPostJSON('/api/users', {
        email,
        password,
        name,
        address,
        geoloc,
      });
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      await userCredential.user.sendEmailVerification();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-blue-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login">
              <a className="font-medium text-red-600 hover:text-red-500">
                sign in
              </a>
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div>
              <label htmlFor="address" className="sr-only">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Address"
                onChange={(e) => onChangeAddress(e.target.value)}
                value={address}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>

          {values && (
            <div className="mt-3">
              <h3 className="text-sm text-gray-700 font-medium mb-2">
                Please select an address below:
              </h3>
              {values.map((value: any) => (
                <button
                  type="button"
                  key={value.place_name}
                  className="text-sm text-gray-500 font-normal hover:text-red-500 cursor-pointer mt-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 rounded-md w-full text-left"
                  onClick={() => onAddressClick(value.place_name, value.center)}
                >
                  {value.place_name}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-red-500 group-hover:text-red-400"
                  aria-hidden="true"
                />
              </span>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
