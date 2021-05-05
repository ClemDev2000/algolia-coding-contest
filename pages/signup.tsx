import { useContext, useState } from 'react';
import { auth } from '../lib/firebase';
import { fetchPostJSON } from '../utils/api-helpers';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import ErrorMessage from '../components/ErrorMessage';
import { FormButton, FormField, FormHead } from '../components/Forms';

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
        <FormField
          label="First name"
          id="first_name"
          name="first_name"
          type="text"
          autoComplete="given-name"
          required
          roundedTop
          value={firstName}
          setValue={setFirstName}
          placeholder="First name"
        />
        <FormField
          label="Last name"
          id="last_name"
          name="last_name"
          type="text"
          autoComplete="family-name"
          required
          value={lastName}
          setValue={setLastName}
          placeholder="Last name"
        />
        <FormField
          label="Address"
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          required
          roundedBottom
          value={address}
          setValue={onChangeAddress}
          placeholder="Address"
        />

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
          <FormField
            label="Email address"
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            roundedTop
            value={email}
            setValue={setEmail}
            placeholder="Email address"
          />
        </div>
        <FormField
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          roundedBottom
          value={password}
          setValue={setPassword}
          placeholder="Password"
        />
      </div>

      <ErrorMessage message={error} />

      <FormButton loading={loading} text="Sign Up" />
    </FormHead>
  );
}
