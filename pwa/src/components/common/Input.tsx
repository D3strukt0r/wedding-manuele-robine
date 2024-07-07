import { forwardRef, InputHTMLAttributes, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import { FieldError } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  layout?: 'primary' | 'app-primary';
  extra?: ReactNode;
  error?: FieldError;
}
const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  layout = 'primary',
  extra,
  error,
  ...props
}, ref) => {
  const labelLinked = useMemo(() => {
    return label && (
      <label
        htmlFor={props.id ?? props.name}
        className={clsx('block leading-6 text-gray-900', {
          'font-medium': layout !== 'primary',
          'font-noto-sans': layout === 'app-primary',
        })}
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
      <div
        className={clsx('relative shadow-sm', {
          'mt-2': labelBar,
          'rounded-md': layout === 'primary',
        })}
      >
        <input
          type="text"
          {...props}
          ref={ref}
          id={props.id ?? props.name}
          className={clsx(
            props.className,
            'block w-full border-0 py-1.5 sm:text-sm sm:leading-6',
            {
              'rounded-md ring-1 ring-inset focus:ring-2 focus:ring-inset': layout === 'primary',
              'peer focus:ring-0': layout === 'app-primary',
              'text-gray-900 placeholder:text-gray-400': !props.disabled,
              'bg-gray-300 text-gray-600 placeholder:text-gray-500': props.disabled,
              'ring-gray-300 focus:ring-blue-600': !error,
              'pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
            },
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id ?? props.name}-error` : undefined}
        />
        {layout === 'app-primary' && (
          <div
            className={clsx('absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2', {
              'peer-focus:border-app-green-dark': !error,
              'peer-focus:border-red-500': error,
            })}
            aria-hidden="true"
          />
        )}
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
