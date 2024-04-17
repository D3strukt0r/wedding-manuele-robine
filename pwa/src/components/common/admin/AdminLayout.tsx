import {Fragment, MouseEventHandler, ReactNode, useState} from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faChevronDown, faGear, faMagnifyingGlass, faX, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import {faBell, faUser} from '@fortawesome/free-regular-svg-icons';
import Logo from "../../../assets/Logo.tsx";
import {useTranslation} from 'react-i18next';

interface Navigation {
  name: string;
  href: string;
  icon: IconDefinition;
  current: boolean;
}
interface UserNavigation {
  name: string;
  href: string;
}
interface UserNavigationClickHandler {
  name: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface AdminLayoutProps {
  navigation: Navigation[];
  userNavigation: (UserNavigation|UserNavigationClickHandler)[];
  user: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({navigation, userNavigation, user, children}: AdminLayoutProps) {
  const {t} = useTranslation('app');
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">{t('admin.sidebar.close')}</span>
                      <FontAwesomeIcon icon={faX} className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="h-8 w-auto">
                      <Logo mode="light" className="h-8 w-auto" />
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className={clsx(
                                  item.current
                                    ? 'bg-gray-50 text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <FontAwesomeIcon
                                  icon={item.icon}
                                  className={clsx(
                                    item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      {/*<li className="mt-auto">*/}
                      {/*  <a*/}
                      {/*    href="#"*/}
                      {/*    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"*/}
                      {/*  >*/}
                      {/*    <FontAwesomeIcon*/}
                      {/*      icon={faGear}*/}
                      {/*      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"*/}
                      {/*      aria-hidden="true"*/}
                      {/*    />*/}
                      {/*    Settings*/}
                      {/*  </a>*/}
                      {/*</li>*/}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="h-8 w-auto">
              <Logo mode="light" className="h-8 w-auto" />
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={clsx(
                          item.current
                            ? 'bg-gray-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={clsx(
                            item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              {/*<li className="mt-auto">*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"*/}
              {/*  >*/}
              {/*    <FontAwesomeIcon*/}
              {/*      icon={faGear}*/}
              {/*      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600"*/}
              {/*      aria-hidden="true"*/}
              {/*    />*/}
              {/*    Settings*/}
              {/*  </a>*/}
              {/*</li>*/}
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">{t('admin.sidebar.open')}</span>
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <span className="flex flex-1"></span>
            {/*<form className="relative flex flex-1" action="#" method="GET">*/}
            {/*  <label htmlFor="search-field" className="sr-only">*/}
            {/*    Search*/}
            {/*  </label>*/}
            {/*  <FontAwesomeIcon*/}
            {/*    icon={faMagnifyingGlass}*/}
            {/*    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"*/}
            {/*    aria-hidden="true"*/}
            {/*  />*/}
            {/*  <input*/}
            {/*    id="search-field"*/}
            {/*    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"*/}
            {/*    placeholder="Search..."*/}
            {/*    type="search"*/}
            {/*    name="search"*/}
            {/*  />*/}
            {/*</form>*/}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/*<button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">*/}
              {/*  <span className="sr-only">View notifications</span>*/}
              {/*  <FontAwesomeIcon icon={faBell} className="h-6 w-6" aria-hidden="true" />*/}
              {/*</button>*/}

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">{t('admin.userMenu.open')}</span>
                  <div className="h-8 w-8 rounded-full bg-gray-50 flex justify-center items-center">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                      {user}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) =>
                          'href' in item ? (
                            <a
                              href={item.href}
                              className={clsx(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm font-semibold'
                              )}
                            >
                              {item.name}
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={item.onClick}
                              className={clsx(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block w-full px-4 py-2 text-sm font-semibold text-left'
                              )}
                            >
                              {item.name}
                            </button>
                          )
                        }
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
