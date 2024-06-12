import { Key } from 'react';
import clsx from 'clsx';

export interface ListCardProps {
  items: {
    id: Key;
    content: string;
  }[];
  customHeight?: boolean;
  wrapperClassName?: string;
}

export default function ListCard({ items, customHeight, wrapperClassName }: ListCardProps) {
  return (
    <div className={clsx('overflow-hidden bg-white shadow sm:rounded-md', wrapperClassName)}>
      <ul role="list" className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className={clsx('px-4 sm:px-6', {'py-4': !customHeight})}>
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
