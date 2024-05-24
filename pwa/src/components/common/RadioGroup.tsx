import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface Option extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  value: Exclude<
    InputHTMLAttributes<HTMLInputElement>['value'],
    readonly string[]
  >;
}
interface Props {
  label?: string;
  legend?: string;
  inline?: boolean;
  options: Option[];
  error?: FieldError;
  disabled?: boolean;
}
export default function RadioGroup({
  label,
  legend,
  inline = false,
  options,
  error,
  disabled,
}: Props) {
  return (
    <>
      {label && (
        <label className="text-base font-noto-sans text-gray-900">
          {label}
        </label>
      )}
      <fieldset>
        {legend && (
          <legend className="sr-only">{legend}</legend>
        )}
        <div
          className={clsx('space-y-4', {
            'sm:flex sm:items-center sm:space-x-10 sm:space-y-0': inline,
          })}
        >
          {options.map(({ title, ...props }) => (
            <div key={props.value} className="flex items-center">
              <input
                // defaultChecked={option.id === 'email'}
                {...props}
                type="radio"
                id={`${props.name}.${props.value}`}
                className={clsx(
                  props.className,
                  'h-4 w-4',
                  {
                    'text-app-green-dark': !disabled && !props.disabled,
                    'text-gray-500': disabled || props.disabled,
                    'border-gray-300 focus:ring-app-green-dark': !error,
                    'focus:ring-red-500': error,
                  }
                )}
                disabled={disabled}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${props.id ?? props.name}-error` : undefined}
              />
              <label
                htmlFor={`${props.name}.${props.value}`}
                className="ml-3 block text-sm font-noto-sans leading-6 text-gray-900"
              >
                {title}
              </label>
            </div>
          ))}
        </div>
        {error && (
          <div className="text-sm text-red-600" id={`${options?.[0].name}-error`}>
            {error.types ? Object.entries(error.types).map(([type, message]) => (
              <p key={type} role="alert">{message}</p>
            )) : (
              <p role="alert">{error.message}</p>
            )}
          </div>
        )}
      </fieldset>
    </>
  );
}
