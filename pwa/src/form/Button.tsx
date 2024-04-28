import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  layout?: 'primary' | 'secondary';
  loading?: boolean;
}
export default function Button({
  layout = 'primary',
  loading = false,
  children,
  ...props
}: Props) {
  const disabled = loading || props.disabled;
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex justify-center items-center text-sm noto-sans-regular rounded-md px-3 py-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        props.className,
        {
          'bg-app-red-dark text-white hover:bg-app-gray-dark focus-visible:outline-app-red-dark': !disabled && layout === 'primary',
          'text-gray-900': !disabled && layout === 'secondary',
          'bg-gray-300 text-gray-600': disabled,
        }
      )}
      disabled={disabled}
    >
      {loading && (
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      )}
      {children}
    </button>
  );
}
