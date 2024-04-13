import {forwardRef, InputHTMLAttributes, ReactNode} from "react";
import clsx from 'clsx';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}
const Input = forwardRef<HTMLInputElement, Props>(({label, description, ...props}, ref) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          {...props}
          id={props.id ?? props.name}
          aria-describedby={description ? `${props.id ?? props.name}-description` : undefined}
          className={clsx(
            props.className,
            'h-4 w-4 rounded border-gray-300 text-red-dark focus:ring-red-dark',
          )}
          type="checkbox"
          ref={ref}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        {label && (
          <label htmlFor={props.id ?? props.name} className="noto-sans-regular text-gray-900">
            {label}
          </label>
        )}
        {description && (
          <p id={`${props.id ?? props.name}-description`} className="text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

export default Input;
