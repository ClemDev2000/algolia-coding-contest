import Link from 'next/link';
import Logo from './Logo';

export default function FormHead({
  title,
  subtitle,
  link,
  children,
  onSubmit,
}) {
  return (
    <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href={link}>
              <a className="font-medium text-red-600 hover:text-red-500">
                {subtitle}
              </a>
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
}
