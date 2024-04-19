import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}
const Input = forwardRef<HTMLInputElement, Props>(({
  label,
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
        id={props.id ?? props.name}
        className={clsx(
          props.className,
          'peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6',
        )}
        ref={ref}
      />
      <div
        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-app-red-dark"
        aria-hidden="true"
      />
    </div>
  </>
));

export default Input;
