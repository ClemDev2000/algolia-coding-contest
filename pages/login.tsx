import { LockClosedIcon } from '@heroicons/react/solid';
import { useContext, useState } from 'react';
import { auth, authPersistence } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import ErrorMessage from '../components/ErrorMessage';
import FormHead from '../components/FormHead';

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
          Sign In
        </button>
      </div>
    </FormHead>
  );
}
