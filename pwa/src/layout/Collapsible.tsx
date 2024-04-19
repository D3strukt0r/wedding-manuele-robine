import { Disclosure } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';

interface Props {
  menuOptions: { key: string; title: ReactNode; text: ReactNode }[];
}
export default function Collapsible({
  menuOptions,
}: Props) {
  return menuOptions.map((item, index) => (
    <Disclosure
      as="div"
      key={item.key}
      className={clsx('border-b-[1px] border-app-gray-dark', {
        'border-t-[1px]': index === 0,
      })}
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="py-2">
            <FontAwesomeIcon
              icon={faChevronDown}
              className={clsx(
                'mr-4 transform transition-transform motion-reduce:transition-none',
                { 'rotate-180': open },
              )}
            />
            <span className="text-lg philosopher-regular">{item.title}</span>
          </Disclosure.Button>
          <Disclosure.Panel className="whitespace-pre-line ml-8 noto-sans-regular">
            {item.text}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  ));
}
