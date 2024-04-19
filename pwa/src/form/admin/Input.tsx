import { forwardRef, InputHTMLAttributes, ReactNode, useMemo } from 'react';
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  extra?: ReactNode;
}
const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  extra,
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
      <div className={clsx({ 'mt-2': labelBar })}>
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
