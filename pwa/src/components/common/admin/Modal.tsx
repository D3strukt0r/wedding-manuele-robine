import { ButtonHTMLAttributes, Fragment, ReactNode, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark, faSpinner,
  faTriangleExclamation,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface ActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  layout: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}
interface Props {
  type?: 'success' | 'info' | 'warning' | 'error';
  title: ReactNode;
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  actions: ActionProps[];
}
export default function Modal({ type, title, children, open, setOpen, actions }: Props) {
  const { t } = useTranslation('app');

  const icon = useMemo(() => {
    if (type === 'success') {
      return faCircleCheck;
    }
    if (type === 'info') {
      return faCircleInfo;
    }
    if (type === 'warning') {
      return faTriangleExclamation;
    }
    if (type === 'error') {
      return faCircleXmark;
    }
    return null;
  }, [type]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">{t('modal.close')}</span>
                    <FontAwesomeIcon icon={faX} className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  {icon && (
                    <div
                      className={clsx('mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 mb-3 sm:mr-4 sm:mb-0', {
                        'bg-green-100': type === 'success',
                        'bg-blue-100': type === 'info',
                        'bg-yellow-100': type === 'warning',
                        'bg-red-100': type === 'error',
                      })}
                    >
                      <FontAwesomeIcon
                        icon={icon}
                        className={clsx('h-6 w-6', {
                          'text-green-600': type === 'success',
                          'text-blue-600': type === 'info',
                          'text-yellow-600': type === 'warning',
                          'text-red-600': type === 'error',
                        })}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div className="text-center sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      {children}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {actions.map(({text, layout, loading = false, ...action}, index) => {
                    const isFirst = index === 0;
                    const isLast = index === actions.length - 1;
                    return (
                      <button
                        key={text}
                        type="button"
                        {...action}
                        className={clsx('inline-flex w-full justify-center items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:w-auto', {
                          'bg-red-600 text-white hover:bg-red-500': layout === 'danger',
                          'bg-blue-600 text-white hover:bg-blue-500': layout === 'primary',
                          'bg-white text-gray-900 hover:bg-gray-50 ring-1 ring-inset ring-gray-300': layout === 'secondary',
                          'sm:ml-3': !isLast,
                          'mt-3 sm:mt-0': !isFirst,
                        })}
                        onClick={action.onClick}
                        disabled={loading || action.disabled}
                      >
                        {loading && (
                          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        )}
                        {text}
                      </button>
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
