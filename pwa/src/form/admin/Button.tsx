import clsx from "clsx";
import {ButtonHTMLAttributes} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  layout?: 'primary' | 'secondary';
  loading?: boolean;
}
export default function Button({layout = 'primary', loading = false, children, ...props}: Props) {
  return (
    <button
      {...props}
      className={clsx(
        'flex justify-center text-sm font-semibold leading-6',
        props.className,
        {
          'rounded-md bg-blue-600 px-3 py-1.5 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600': layout === 'primary',
          'text-gray-900': layout === 'secondary',
        }
      )}
      disabled={loading || props.disabled}
    >
      {loading && (
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      )}
      {children}
    </button>
  );
}
