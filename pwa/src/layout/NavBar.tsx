import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import clsx from "clsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faX} from "@fortawesome/free-solid-svg-icons";
import {useTranslation} from "react-i18next";
import {faUser} from "@fortawesome/free-regular-svg-icons";

export type MenuItem = {
  label: string;
  route: string;
}

export default function NavBar({logo, menuItems}: { logo: React.ReactNode, menuItems: MenuItem[] }) {
  const {t} = useTranslation("app")
  const current = null; // TODO: get current route

  return (
    <Disclosure as="nav" className="bg-red-dark shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <div className="h-8 w-auto">
                    {logo}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex">
                <div className="hidden sm:mr-6 sm:flex">
                  {menuItems.map((item, index) => (
                    <a
                      key={item.label}
                      href={item.route}
                      className={clsx(
                        item.route === current ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-50 hover:border-gray-100 hover:text-gray-200',
                        'inline-flex items-center border-b-2 pt-1 text-sm font-medium uppercase',
                      )}
                    >
                      <span
                        className={clsx(
                          'flex items-center h-8 px-3',
                          index !== 0 ? 'border-l-[1px] border-gray-50' : null
                        )}
                      >
                        {item.label}
                      </span>
                    </a>
                  ))}
                </div>
                {/* Profile dropdown */}
                <div className="sm:flex sm:items-center">
                  <Menu
                    as="div"
                    className="relative ml-3"
                  >
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">{t('menu.user.open')}</span>
                        <div className="h-8 w-8 rounded-full flex justify-center items-center">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({active}) => (
                            <a
                              href="#"
                              className={clsx(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              {t('menu.logout')}
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-50 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">{t('accessibility.menu.open')}</span>
                  {open ? (
                    <FontAwesomeIcon
                      icon={faX}
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBars}
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pb-3 pt-2">
              {menuItems.map((item, index) => (
                <Disclosure.Button
                  key={item.label}
                  as="a"
                  href={item.route}
                  className={clsx(
                    item.route === current ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-transparent text-gray-50 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                    'block border-l-4 pl-3 pr-4 text-base font-medium uppercase'
                  )}
                >
                  <span
                    className={clsx(
                      'flex items-center border-b-[1px] border-gray-50 py-3',
                      index === 0 ? 'border-t-[1px]' : null
                    )}
                  >
                    {item.label}
                  </span>
                </Disclosure.Button>
                ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-50 hover:bg-gray-100 hover:text-gray-500 uppercase"
                >
                  {t('menu.logout')}
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
