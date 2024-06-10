import { Key } from 'react';

export interface ListCardProps {
  items: {
    id: Key;
    content: string;
  }[];
}

export default function ListCard({ items }: ListCardProps) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="px-4 py-4 sm:px-6">
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
