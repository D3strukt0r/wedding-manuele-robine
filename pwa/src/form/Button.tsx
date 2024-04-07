import clsx from "clsx";
import {ButtonHTMLAttributes} from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  layout?: 'primary' | 'secondary';
}
export default function Button({layout = 'primary', ...props}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        'text-sm noto-sans-regular',
        props.className,
        {
          'rounded-md bg-red-dark px-3 py-2 text-white shadow-sm hover:bg-gray-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-dark': layout === 'primary',
          'text-gray-900': layout === 'secondary',
        }
      )}
    />
  );
}
