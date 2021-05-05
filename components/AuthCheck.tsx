import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { user } = useContext(UserContext);

  return user
    ? props.children
    : props.fallback || (
        <div className="mt-10 w-full flex justify-center">
          <Link href="/login">
            <a className="font-semibold text-base text-gray-600">
              You must be signed in to access this page
            </a>
          </Link>
        </div>
      );
}
