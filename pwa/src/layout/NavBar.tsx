import { forwardRef, Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faX } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Link, LinkProps } from 'react-router-dom';
import { useAuthenticationContext } from '#/utils/authentication';

const DisclosureLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link ref={ref} {...props} />
));

export type MenuItem = {
  label: string;
  route: string;
};

interface Props {
  logo: React.ReactNode;
  menuItems: MenuItem[];
}
export default function NavBar({
  logo,
  menuItems,
}: Props) {
  const { t } = useTranslation('app');
  const current = null; // TODO: get current route
  const [authentication, updateAuthentication] = useAuthenticationContext();

  return (
    <Disclosure as="header" className="absolute top-0 left-0 right-0 bg-black/75 shadow z-20">
      {({ open }) => (
        <>
          {/* Desktop Menu */}
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex h-20 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <div
                    className="h-full p-4 w-auto cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector('#root')!.scrollTo({top: 0});
                    }}
                  >
                    {logo}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 lg:flex">
                <nav className={clsx('hidden lg:flex', {'sm:mr-6': authentication})}>
                  {menuItems.map((item, index) => (
                    <a
                      key={item.label}
                      href={item.route}
                      className={clsx(
                        item.route === current
                          ? 'border-app-green-dark text-gray-900'
                          : 'border-transparent text-gray-50 hover:border-gray-100 hover:text-gray-200',
                        'inline-flex items-center border-b-2 pt-1 text-menu font-medium uppercase font-philosopher',
                      )}
                    >
                      <span
                        className={clsx(
                          'flex items-center h-8 px-3',
                          index !== 0 ? 'border-l-[1px] border-gray-50' : null,
                        )}
                      >
                        {item.label}
                      </span>
                    </a>
                  ))}
                </nav>
                {/* Profile dropdown */}
                {authentication && (
                  <div className="lg:flex lg:items-center">
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-app-green focus:ring-offset-2">
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
                          <Menu.Item disabled>
                            <span className="block px-4 py-2 text-sm text-gray-700 font-noto-sans opacity-75">
                              {authentication.username}
                            </span>
                          </Menu.Item>
                          {/* TODO: Don't check for roles directly in frontend */}
                          {authentication.roles.includes('ROLE_ADMIN') && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/admin"
                                  className={clsx(
                                    'block px-4 py-2 text-sm text-gray-700 font-noto-sans',
                                    { 'bg-gray-100': active },
                                  )}
                                >
                                  {t('menu.admin')}
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="button"
                                className={clsx(
                                  'w-full text-left block px-4 py-2 text-sm text-gray-700 font-noto-sans',
                                  { 'bg-gray-100': active },
                                )}
                                onClick={() => {
                                  updateAuthentication(null);
                                }}
                              >
                                {t('menu.logout')}
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-50 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-app-green">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">
                    {t('accessibility.menu.open')}
                  </span>
                  {open ? (
                    <FontAwesomeIcon icon={faX} className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FontAwesomeIcon icon={faBars} className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Transition
            enter="transition ease duration-200 transform"
            enterFrom="opacity-0 -translate-y-12"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease duration-200 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-12"
          >
            <Disclosure.Panel className="lg:hidden">
              <nav className="pb-3 pt-2">
                {menuItems.map((item, index) => (
                  <Disclosure.Button
                    key={item.label}
                    as="a"
                    href={item.route}
                    className={clsx(
                      item.route === current
                        ? 'border-app-green-dark bg-gray-50 text-app-green-dark'
                        : 'border-transparent text-gray-50 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                      'block border-l-4 pl-3 pr-4 text-menu font-medium uppercase font-philosopher',
                    )}
                  >
                    <span
                      className={clsx(
                        'flex items-center border-b-[1px] border-gray-50 py-3',
                        index === 0 ? 'border-t-[1px]' : null,
                      )}
                    >
                      {item.label}
                    </span>
                  </Disclosure.Button>
                ))}
              </nav>
              {authentication && (
                <div className="border-t border-gray-600 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="text-menu font-medium text-gray-50 font-philosopher">
                      {authentication.username}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {/* TODO: Don't check for roles directly in frontend */}
                    {authentication.roles.includes('ROLE_ADMIN') && (
                      <Disclosure.Button
                        as={DisclosureLink}
                        to="/admin"
                        className="block px-4 py-2 text-menu font-medium text-gray-50 hover:bg-gray-100 hover:text-gray-500 uppercase font-philosopher"
                      >
                        {t('menu.admin')}
                      </Disclosure.Button>
                    )}
                    <Disclosure.Button
                      as="button"
                      className="w-full text-left block px-4 py-2 text-menu font-medium text-gray-50 hover:bg-gray-100 hover:text-gray-500 uppercase font-philosopher"
                      onClick={() => {
                        updateAuthentication(null);
                      }}
                    >
                      {t('menu.logout')}
                    </Disclosure.Button>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
