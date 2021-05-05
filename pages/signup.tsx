import { LockClosedIcon } from '@heroicons/react/solid';
import { useContext, useState } from 'react';
import { auth } from '../lib/firebase';
import { fetchPostJSON } from '../utils/api-helpers';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import ErrorMessage from '../components/ErrorMessage';
import FormHead from '../components/FormHead';

const geocodingClient = mapbox({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
});

export default function Signup() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Address states
  const [address, setAddress] = useState('');
  const [geoloc, setGeoloc] = useState<any>(null);
  const [values, setValues] = useState<any>(null);
  const [city, setCity] = useState('');
  const [line1, setLine1] = useState('');
  const [region, setRegion] = useState('');
  const [postcode, setPostcode] = useState('');

  if (user) router.push('/');

  const onChangeAddress = async (val: string) => {
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
    } catch (err) {
      console.warn(err.message);
    }
  };

  const onAddressClick = async (
    address: string,
    center: number[],
    context: any[],
    value: any
  ) => {
    setAddress(address);
    setGeoloc({
      lng: center[0],
      lat: center[1],
    });
    setCity(context.find((f) => f.id.startsWith('place.'))?.text);
    setRegion(context.find((f) => f.id.startsWith('region.'))?.text);
    setPostcode(context.find((f) => f.id.startsWith('postcode.'))?.text);
    setLine1(`${value.address} ${value.text}`);
    setValues(null);
  };

  const handleSignUp: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await fetchPostJSON('/api/users', {
        email,
        password,
        firstName,
        lastName,
        address,
        geoloc,
        city,
        line1,
        postcode,
        region,
      });
      if (response.message) throw new Error(response.message);
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      await userCredential.user.sendEmailVerification();
      router.push('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <FormHead
      title="Create your account"
      subtitle="sign in"
      link="/login"
      onSubmit={handleSignUp}
    >
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="first_name" className="sr-only">
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
            placeholder="First name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </div>
        <div>
          <label htmlFor="last_name" className="sr-only">
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
            placeholder="Last name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
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
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
            placeholder="Address"
            onChange={(e) => onChangeAddress(e.target.value)}
            value={address}
          />
        </div>

        {values && (
          <div className="pt-3">
            <h3 className="text-sm text-gray-700 font-medium mb-2">
              Please select an address below:
            </h3>
            {values.map((value: any) => (
              <button
                type="button"
                key={value.place_name}
                className="text-sm text-gray-500 font-normal hover:text-red-500 cursor-pointer mt-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 rounded-md w-full text-left"
                onClick={() =>
                  onAddressClick(
                    value.place_name,
                    value.center,
                    value.context,
                    value
                  )
                }
              >
                {value.place_name}
              </button>
            ))}
          </div>
        )}

        <div className="pt-6">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
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

      <ErrorMessage message={error} />

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
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
          Sign Up
        </button>
      </div>
    </FormHead>
  );
}
