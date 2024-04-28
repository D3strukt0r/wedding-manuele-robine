import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { FieldError } from 'react-hook-form';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: FieldError;
}
const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  description,
  error,
  ...props
}, ref) => (
  <div className="relative flex items-start">
    <div className="flex h-6 items-center">
      <input
        {...props}
        id={props.id ?? props.name}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={description ? `${props.id ?? props.name}-description` : undefined}
        className={clsx(
          props.className,
          'h-4 w-4 rounded',
          {
            'text-app-red-dark': !props.disabled,
            'text-gray-500': props.disabled,
            'border-gray-300 focus:ring-app-red-dark': !error,
            'focus:ring-red-500': error,
          }
        )}
        type="checkbox"
        ref={ref}
      />
    </div>
    <div className="ml-3 text-sm leading-6">
      {label && (
        <label
          htmlFor={props.id ?? props.name}
          className="noto-sans-regular text-gray-900"
        >
          {label}
        </label>
      )}
      {description && (
        <p
          id={`${props.id ?? props.name}-description`}
          className="text-gray-500"
        >
          {description}
        </p>
      )}
      {error && (
        <div className="text-sm text-red-600" id={`${props.id ?? props.name}-error`}>
          {error.types ? Object.entries(error.types).map(([type, message]) => (
            <p key={type} role="alert">{message}</p>
          )) : (
            <p role="alert">{error.message}</p>
          )}
        </div>
      )}
    </div>
  </div>
));

export default Input;
