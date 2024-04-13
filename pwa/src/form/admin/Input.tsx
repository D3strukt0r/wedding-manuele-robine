import {forwardRef, InputHTMLAttributes, ReactNode} from "react";
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}
const Input = forwardRef<HTMLInputElement, Props>(({label, ...props}, ref) => {
  return (
    <>
      {label && (
        <label
          htmlFor={props.id ?? props.name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <div className={clsx({'mt-2': label})}>
        <input
          type="text"
          {...props}
          id={props.id ?? props.name}
          className={clsx(
            props.className,
            'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
          )}
          ref={ref}
        />
      </div>
    </>
  );
});

export default Input;
