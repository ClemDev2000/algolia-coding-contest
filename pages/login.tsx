import { useContext, useState } from 'react';
import { auth, authPersistence } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import ErrorMessage from '../components/ErrorMessage';
import { FormField, FormButton, FormHead } from '../components/Forms';

export default function Example() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [remember, setRemember] = useState(true);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const router = useRouter();

  if (user) router.push('/');

  const handleSignIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (remember) await auth.setPersistence(authPersistence.LOCAL);
      else await auth.setPersistence(authPersistence.SESSION);
      await auth.signInWithEmailAndPassword(email, password);
      router.push('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <FormHead
      title="Sign in to your account"
      subtitle="create your account"
      link="/signup"
      onSubmit={handleSignIn}
    >
      <div className="rounded-md shadow-sm -space-y-px">
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember_me"
            name="remember_me"
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember_me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link href="/forgotten_password">
            <a className="font-medium text-red-600 hover:text-red-500">
              Forgot your password?
            </a>
          </Link>
        </div>
      </div>

      <FormButton loading={loading} text="Sign In" />
    </FormHead>
  );
}
