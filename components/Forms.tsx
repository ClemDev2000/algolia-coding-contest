import { LockClosedIcon } from '@heroicons/react/solid';
import Link from 'next/link';
import React from 'react';
import Logo from './Logo';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function FormHead({ title, subtitle, link, children, onSubmit }) {
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

export function FormField({
  label,
  id,
  name,
  type,
  autoComplete,
  required,
  value,
  setValue,
  placeholder,
  roundedTop,
  roundedBottom,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  autoComplete: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  placeholder: string;
  required?: boolean;
  roundedTop?: boolean;
  roundedBottom?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={classNames(
          roundedTop ? 'rounded-t-md' : '',
          roundedBottom ? 'rounded-b-md' : '',
          'appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm'
        )}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
    </div>
  );
}

export function FormButton({
  loading,
  text,
  disabled,
}: {
  loading: boolean;
  text: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <button
        type="submit"
        disabled={disabled || loading}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
        {text}
      </button>
    </div>
  );
}
