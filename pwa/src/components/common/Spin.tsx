import clsx from 'clsx';
import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props {
  children?: ReactNode;
  spinning?: boolean;
}

export default function Spin({ children, spinning = false }: Props) {
  return (
    <div className={clsx('relative', { 'opacity-50 pointer-events-none': spinning })}>
      {children}
      {spinning && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} size="2xl" spin className="text-gray-400" />
        </div>
      )}
    </div>
  )
}
