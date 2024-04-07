import {ReactNode} from "react";
import clsx from "clsx";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

export default function AlignedCard({id, image, topContent, bottomContent, align, backgroundColor, imageShadowColor}: {
  id?: string;
  image: ReactNode;
  topContent: ReactNode;
  bottomContent: ReactNode;
  align: 'left' | 'right';
  backgroundColor: 'red-light' | 'gray-dark' | 'white';
  imageShadowColor: 'red-light' | 'red-dark' | 'gray-dark' | 'white';
}) {
  return (
    // Gradient background to have two different colors on both sides
    <div
      id={id}
      className={clsx(
        'bg-gradient-to-r from-45% to-55%',
        {
          'from-red-light': align === 'left' && backgroundColor === 'red-light',
          'from-gray-dark': align === 'left' && backgroundColor === 'gray-dark',
          'from-white': align === 'left' && backgroundColor === 'white',
          'to-transparent': align === 'left',
          'from-transparent': align === 'right',
          'to-red-light': align === 'right' && backgroundColor === 'red-light',
          'to-gray-dark': align === 'right' && backgroundColor === 'gray-dark',
          'to-white': align === 'right' && backgroundColor === 'white',
        },
      )}
    >
      {/* Container */}
      <div
        className={clsx(
          'mx-auto max-w-7xl md:px-6 lg:px-8',
          {
            'md:pr-20 lg:pr-32': align === 'left',
            'md:pl-20 lg:pl-32': align === 'right',
          },
        )}
      >
        {/* Container background color */}
        <div
          className={clsx({
            'bg-red-light': backgroundColor === 'red-light',
            'bg-gray-dark': backgroundColor === 'gray-dark',
            'bg-white': backgroundColor === 'white',
          })}
        >
          {/* Content split and order */}
          <div
            className={clsx(
              'flex flex-col',
              {
                'md:flex-row-reverse': align === 'left',
                'md:flex-row': align === 'right',
              },
            )}
          >
            {/* Image always comes first on mobile */}
            <div className="flex-1">
              {/* if image is a string */}
              {typeof image === 'string' ? (
                <img
                  src={image}
                  alt=""
                  className={clsx(
                    'w-full md:mt-12',
                    {
                      'md:translate-x-12': align === 'left',
                      'md:-translate-x-12': align === 'right',
                      [`md:shadow-[-1rem_1rem_0_0_#dab4a7]`]: imageShadowColor === 'red-light',
                      [`md:shadow-[-1rem_1rem_0_0_#8c594d]`]: imageShadowColor === 'red-dark',
                      [`md:shadow-[-1rem_1rem_0_0_#403a37]`]: imageShadowColor === 'gray-dark',
                      [`md:shadow-[-1rem_1rem_0_0_#ffffff]`]: imageShadowColor === 'white',
                    },
                  )}
                />
              ) : (
                <div
                  className={clsx(
                    'h-80 md:mt-12',
                    {
                      'md:translate-x-12': align === 'left',
                      'md:-translate-x-12': align === 'right',
                      [`md:shadow-[-1rem_1rem_0_0_#dab4a7]`]: imageShadowColor === 'red-light',
                      [`md:shadow-[-1rem_1rem_0_0_#8c594d]`]: imageShadowColor === 'red-dark',
                      [`md:shadow-[-1rem_1rem_0_0_#403a37]`]: imageShadowColor === 'gray-dark',
                      [`md:shadow-[-1rem_1rem_0_0_#ffffff]`]: imageShadowColor === 'white',
                    },
                  )}
                >
                  {image}
                </div>
              )}
            </div>
            <div
              className={clsx(
                'flex-1 m-8 md:mx-0',
                {'text-white': backgroundColor === 'gray-dark'}
              )}
            >
              {topContent}
            </div>
          </div>
          <div
            className={clsx(
              'md:pt-8',
              {
                'bg-red-light': backgroundColor === 'red-light',
                'bg-gray-dark': backgroundColor === 'gray-dark',
                'bg-white': backgroundColor === 'white'
              },
            )}
          >
            <div
              className={clsx(
                'px-8 pb-8',
                {
                  'md:pl-0': align === 'left',
                  'md:pr-0': align === 'right',
                  'text-white': backgroundColor === 'gray-dark',
                },
              )}
            >
              {bottomContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
