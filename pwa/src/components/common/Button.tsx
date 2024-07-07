import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  layout?: 'app-primary' | 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}
const Button = forwardRef<HTMLButtonElement, Props>(({
  layout = 'primary',
  loading = false,
  children,
  ...props
}, ref) => {
  const disabled = loading || props.disabled;
  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        'inline-flex justify-center items-center text-sm leading-6 px-3 py-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        props.className,
        {
          'font-noto-sans': layout === 'app-primary',
          'font-semibold rounded-md': layout !== 'app-primary',
          'bg-app-green-dark text-white hover:bg-app-gray-dark focus-visible:outline-app-green-dark': !disabled && layout === 'app-primary',
          'bg-blue-600 hover:bg-blue-500 text-white focus-visible:outline-blue-600': !disabled && layout === 'primary',
          'bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 ': !disabled && layout === 'secondary',
          'bg-red-600 hover:bg-red-500 text-white focus-visible:outline-red-600': !disabled && layout === 'danger',
          'bg-gray-300 text-gray-600': disabled,
        },
      )}
      disabled={disabled}
    >
      {loading && (
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      )}
      {children}
    </button>
  );
});

export default Button;
