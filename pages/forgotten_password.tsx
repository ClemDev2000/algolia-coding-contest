import { useContext, useState } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import ErrorMessage from '../components/ErrorMessage';
import { FormButton, FormField, FormHead } from '../components/Forms';

export default function Example() {
  const [email, setEmail] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const router = useRouter();

  if (user) router.push('/');

  const handleResetPassword: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      setLoading(true);
      await auth.sendPasswordResetEmail(email);
      router.push('/');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <FormHead
      title="Reset your password"
      subtitle="sign in"
      link="/login"
      onSubmit={handleResetPassword}
    >
      <div className="rounded-md shadow-sm -space-y-px">
        <FormField
          label="Email address"
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          roundedBottom
          roundedTop
          value={email}
          setValue={setEmail}
          placeholder="Email address"
        />
      </div>

      <ErrorMessage message={error} />

      <FormButton loading={loading} text="Reset my password" />
    </FormHead>
  );
}
