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
}
export default function AlignedCard({
  id,
  image,
  topContent,
  bottomContent,
  align,
  backgroundColor,
  imageShadowColor,
}: Props) {
  return (
    // Gradient background to have two different colors on both sides
    <div
      id={id}
      className={clsx('bg-gradient-to-r from-45% to-55%', {
        'from-app-red-light': align === 'left' && backgroundColor === 'app-red-light',
        'from-app-gray-dark': align === 'left' && backgroundColor === 'app-gray-dark',
        'from-app-green-dark': align === 'left' && backgroundColor === 'app-green-dark',
        'from-app-yellow': align === 'left' && backgroundColor === 'app-yellow',
        'from-app-yellow-dark': align === 'left' && backgroundColor === 'app-yellow-dark',
        'from-app-gray-light': align === 'left' && backgroundColor === 'app-gray-light',
        'from-white': align === 'left' && backgroundColor === 'white',
        'to-transparent': align === 'left',
        'from-transparent': align === 'right',
        'to-app-red-light': align === 'right' && backgroundColor === 'app-red-light',
        'to-app-gray-dark': align === 'right' && backgroundColor === 'app-gray-dark',
        'to-app-green-dark': align === 'right' && backgroundColor === 'app-green-dark',
        'to-app-yellow': align === 'right' && backgroundColor === 'app-yellow',
        'to-app-yellow-dark': align === 'right' && backgroundColor === 'app-yellow-dark',
        'to-app-gray-light': align === 'right' && backgroundColor === 'app-gray-light',
        'to-white': align === 'right' && backgroundColor === 'white',
      })}
    >
      {/* Container */}
      <div
        className={clsx('mx-auto max-w-7xl md:px-6 lg:px-8', {
          'md:pr-20 lg:pr-20': align === 'left',
          'md:pl-20 lg:pl-20': align === 'right',
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
              'md:flex-row-reverse': align === 'left',
              'md:flex-row': align === 'right',
            })}
          >
            {/* Image always comes first on mobile */}
            <div className="flex-1">
              {/* if image is a string */}
              {typeof image === 'string' ? (
                <img
                  src={image}
                  className={clsx('w-full md:mt-12', {
                    'md:translate-x-12': align === 'left',
                    'md:-translate-x-12': align === 'right',
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
                  className={clsx('h-80 md:mt-12', {
                    'md:translate-x-12': align === 'left',
                    'md:-translate-x-12': align === 'right',
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
              className={clsx('flex-1 m-8 md:mx-0', {
                'text-white': ['app-gray-dark', 'app-green-dark'].includes(backgroundColor),
              })}
            >
              {topContent}
            </div>
          </div>
          <div
            className={clsx('md:pt-8', {
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
                'md:pl-0': align === 'left',
                'md:pr-0': align === 'right',
                'text-white': ['app-gray-dark', 'app-green-dark'].includes(backgroundColor),
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
