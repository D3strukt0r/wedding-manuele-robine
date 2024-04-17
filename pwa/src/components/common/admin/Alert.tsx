import {ReactNode, useMemo} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleCheck, faCircleInfo, faCircleXmark, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

interface Props {
  type: 'success' | 'info' | 'warning' | 'error';
  title?: ReactNode;
  text?: ReactNode;
}
export default function Alert({type, title, text}: Props) {
  const icon = useMemo(() => {
    if (type === 'success') {
      return faCircleCheck;
    } else if (type === 'info') {
      return faCircleInfo;
    } else if (type === 'warning') {
      return faTriangleExclamation;
    } else if (type === 'error') {
      return faCircleXmark;
    }
    return null;
  }, [type]);


  return (
    <div
      className={clsx(
        'rounded-md p-4',
        {
          'bg-green-50': type === 'success',
          'bg-blue-50': type === 'info',
          'bg-yellow-50': type === 'warning',
          'bg-red-50': type === 'error',
        }
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className={clsx(
                'h-5 w-5',
                {
                  'text-green-400': type === 'success',
                  'text-blue-400': type === 'info',
                  'text-yellow-400': type === 'warning',
                  'text-red-400': type === 'error',
                }
              )}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          {title && (
            <h3
              className={clsx(
                'text-sm font-medium',
                {
                  'text-green-800': type === 'success',
                  'text-blue-800': type === 'info',
                  'text-yellow-800': type === 'warning',
                  'text-red-800': type === 'error',
                }
              )}
            >
              {title}
            </h3>
          )}
          {text && (
            <div
              className={clsx(
                'mt-2 text-sm',
                {
                  'text-green-700': type === 'success',
                  'text-blue-700': type === 'info',
                  'text-yellow-700': type === 'warning',
                  'text-red-700': type === 'error',
                }
              )}
            >
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
