import { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  id?: string;
  image: ReactNode;
  topContent: ReactNode;
  bottomContent: ReactNode;
  align: 'left' | 'right';
  backgroundColor:
    'app-red-light'
    | 'app-gray-dark'
    | 'app-green-dark'
    | 'app-yellow'
    | 'app-yellow-dark'
    | 'app-gray-light'
    | 'white';
  imageShadowColor:
    | 'app-red-light'
    | 'app-red-dark'
    | 'app-gray-dark'
    | 'app-green-dark'
    | 'app-yellow-dark'
    | 'app-gray-light'
    | 'white';
  isLast?: boolean;
}
export default function AlignedCard({
  id,
  image,
  topContent,
  bottomContent,
  align,
  backgroundColor,
  imageShadowColor,
  isLast,
}: Props) {
  return (
    // Gradient background to have two different colors on both sides
    <div
      id={id}
      className={clsx('xl:bg-gradient-to-r xl:from-45% xl:to-55% scroll-mt-20', {
        'xl:from-app-red-light': align === 'left' && backgroundColor === 'app-red-light',
        'xl:from-app-gray-dark': align === 'left' && backgroundColor === 'app-gray-dark',
        'xl:from-app-green-dark': align === 'left' && backgroundColor === 'app-green-dark',
        'xl:from-app-yellow': align === 'left' && backgroundColor === 'app-yellow',
        'xl:from-app-yellow-dark': align === 'left' && backgroundColor === 'app-yellow-dark',
        'xl:from-app-gray-light': align === 'left' && backgroundColor === 'app-gray-light',
        'xl:from-white': align === 'left' && backgroundColor === 'white',
        'xl:to-transparent': align === 'left',
        'xl:from-transparent': align === 'right',
        'xl:to-app-red-light': align === 'right' && backgroundColor === 'app-red-light',
        'xl:to-app-gray-dark': align === 'right' && backgroundColor === 'app-gray-dark',
        'xl:to-app-green-dark': align === 'right' && backgroundColor === 'app-green-dark',
        'xl:to-app-yellow': align === 'right' && backgroundColor === 'app-yellow',
        'xl:to-app-yellow-dark': align === 'right' && backgroundColor === 'app-yellow-dark',
        'xl:to-app-gray-light': align === 'right' && backgroundColor === 'app-gray-light',
        'xl:to-white': align === 'right' && backgroundColor === 'white',
      })}
    >
      {/* Container */}
      <div
        className={clsx('mx-auto max-w-7xl xl:px-8', {
          'xl:pr-20': align === 'left',
          'xl:pl-20': align === 'right',
        })}
      >
        {/* Container background color */}
        <div
          className={clsx({
            'bg-app-red-light': backgroundColor === 'app-red-light',
            'bg-app-gray-dark': backgroundColor === 'app-gray-dark',
            'bg-app-green-dark': backgroundColor === 'app-green-dark',
            'bg-app-yellow': backgroundColor === 'app-yellow',
            'bg-app-yellow-dark': backgroundColor === 'app-yellow-dark',
            'bg-app-gray-light': backgroundColor === 'app-gray-light',
            'bg-white': backgroundColor === 'white',
          })}
        >
          {/* Content split and order */}
          <div
            className={clsx('flex flex-col', {
              'xl:flex-row-reverse': align === 'left',
              'xl:flex-row': align === 'right',
            })}
          >
            {/* Image always comes first on mobile */}
            <div className="flex-1">
              {/* if image is a string */}
              {typeof image === 'string' ? (
                <img
                  src={image}
                  className={clsx('w-full md:w-[35rem] xl:w-full md:-translate-y-20 xl:-translate-y-0 xl:ml-0 xl:mt-12', {
                    'md:ml-auto': align === 'left',
                    'xl:translate-x-12': align === 'left',
                    'xl:-translate-x-12': align === 'right',
                    'md:shadow-[-1rem_1rem_0_0_#dab4a7]': imageShadowColor === 'app-red-light',
                    'md:shadow-[-1rem_1rem_0_0_#8c594d]': imageShadowColor === 'app-red-dark',
                    'md:shadow-[-1rem_1rem_0_0_#403a37]': imageShadowColor === 'app-gray-dark',
                    'md:shadow-[-1rem_1rem_0_0_#37403d]': imageShadowColor === 'app-green-dark',
                    'md:shadow-[-1rem_1rem_0_0_#f0f0f0]': imageShadowColor === 'app-gray-light',
                    'md:shadow-[-1rem_1rem_0_0_#fff7d0]': imageShadowColor === 'app-yellow-dark',
                    'md:shadow-[-1rem_1rem_0_0_#ffffff]': imageShadowColor === 'white',
                  })}
                />
              ) : (
                <div
                  className={clsx('h-96 w-full md:w-[35rem] xl:w-full md:-translate-y-20 xl:-translate-y-0 xl:ml-0 xl:mt-12', {
                    'md:ml-auto': align === 'left',
                    'xl:translate-x-12': align === 'left',
                    'xl:-translate-x-12': align === 'right',
                    'md:shadow-[-1rem_1rem_0_0_#dab4a7]': imageShadowColor === 'app-red-light',
                    'md:shadow-[-1rem_1rem_0_0_#8c594d]': imageShadowColor === 'app-red-dark',
                    'md:shadow-[-1rem_1rem_0_0_#403a37]': imageShadowColor === 'app-gray-dark',
                    'md:shadow-[-1rem_1rem_0_0_#37403d]': imageShadowColor === 'app-green-dark',
                    'md:shadow-[-1rem_1rem_0_0_#f0f0f0]': imageShadowColor === 'app-gray-light',
                    'md:shadow-[-1rem_1rem_0_0_#fff7d0]': imageShadowColor === 'app-yellow-dark',
                    'md:shadow-[-1rem_1rem_0_0_#ffffff]': imageShadowColor === 'white',
                  })}
                >
                  {image}
                </div>
              )}
            </div>
            <div
              className={clsx('flex-1 m-8 md:-mt-4 xl:mt-8 xl:mx-0', {
                'text-white': ['app-gray-dark', 'app-green-dark'].includes(backgroundColor),
              })}
            >
              {topContent}
            </div>
          </div>
          <div
            className={clsx('md:pt-10', {
              'bg-app-red-light': backgroundColor === 'app-red-light',
              'bg-app-gray-dark': backgroundColor === 'app-gray-dark',
              'bg-app-green-dark': backgroundColor === 'app-green-dark',
              'bg-app-yellow': backgroundColor === 'app-yellow',
              'bg-app-yellow-dark': backgroundColor === 'app-yellow-dark',
              'bg-app-gray-light': backgroundColor === 'app-gray-light',
              'bg-white': backgroundColor === 'white',
            })}
          >
            <div
              className={clsx('px-8 pb-8', {
                'xl:pl-0': align === 'left',
                'xl:pr-0': align === 'right',
                'text-white': ['app-gray-dark', 'app-green-dark'].includes(backgroundColor),
                'md:pb-28 xl:pb-8': !isLast,
              })}
            >
              {bottomContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
