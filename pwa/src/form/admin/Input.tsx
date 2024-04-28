import { forwardRef, InputHTMLAttributes, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import { FieldError } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  extra?: ReactNode;
  error?: FieldError;
}
const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  extra,
  error,
  ...props
}, ref) => {
  const labelLinked = useMemo(() => {
    return label && (
      <label
        htmlFor={props.id ?? props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
    );
  }, [label]);
  const labelBar = useMemo(() => {
    if (label && extra) {
      return (
        <div className="flex items-center justify-between">
          {labelLinked}
          {extra}
        </div>
      );
    }
    if (label) {
      return labelLinked;
    }
    return null;
  }, [label, extra]);

  return (
    <>
      {labelBar}
      <div className={clsx('relative rounded-md shadow-sm', { 'mt-2': labelBar })}>
        <input
          type="text"
          {...props}
          ref={ref}
          id={props.id ?? props.name}
          className={clsx(
            props.className,
            'block w-full rounded-md border-0 py-1.5 ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
            {
              'text-gray-900 placeholder:text-gray-400': !props.disabled,
              'bg-gray-300 text-gray-600 placeholder:text-gray-500': props.disabled,
              'ring-gray-300 focus:ring-blue-600': !error,
              'pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
            },
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id ?? props.name}-error` : undefined}
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
            <p key={type} role="alert">{message}</p>
          )) : (
            <p role="alert">{error.message}</p>
          )}
        </div>
      )}
    </>
  );
});

export default Input;
