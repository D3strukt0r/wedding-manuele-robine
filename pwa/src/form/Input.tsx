import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FieldError } from 'react-hook-form';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: FieldError;
}
const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  error,
  ...props
}, ref) => (
  <>
    {label && (
      <label
        htmlFor={props.id ?? props.name}
        className="block text-sm noto-sans-regular leading-6 text-gray-900"
      >
        {label}
      </label>
    )}
    <div className={clsx('relative', { 'mt-2': label })}>
      <input
        type="text"
        {...props}
        ref={ref}
        id={props.id ?? props.name}
        className={clsx(
          props.className,
          'peer block w-full border-0 py-1.5 focus:ring-0 sm:text-sm sm:leading-6',
          {
            'bg-gray-50 text-gray-900 placeholder:text-gray-400': !props.disabled,
            'bg-gray-300 text-gray-600 placeholder:text-gray-500': props.disabled,
            'ring-gray-300 focus:ring-blue-600': !error,
            'pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
          },
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id ?? props.name}-error` : undefined}
      />
      <div
        className={clsx(
          'absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2',
          {
            'peer-focus:border-app-red-dark': !error,
            'peer-focus:border-red-500': error,
          }
        )}
        aria-hidden="true"
      />
      {error && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
    {error && (
      <div className="mt-2 text-sm text-red-600" id={`${props.id ?? props.name}-error`}>
        {error.types ? Object.entries(error.types).map(([type, message]) => (
          <p key={type}>{message}</p>
        )) : (
          <p>{error.message}</p>
        )}
      </div>
    )}
  </>
));

export default Input;
