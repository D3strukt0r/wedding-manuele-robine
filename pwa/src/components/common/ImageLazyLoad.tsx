import { ComponentProps, useCallback, useMemo, useState } from 'react';
import {BlurhashCanvas} from 'react-blurhash';
import clsx from 'clsx';

// https://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
function gcd(a: number, b: number) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}
export function aspectRatio(width: number, height: number) {
  const divisor = gcd(width, height);
  return [width / divisor, height / divisor];
}

export interface ImageLazyLoadProps {
  src?: HTMLImageElement['src'];
  alt?: HTMLImageElement['alt'];
  blurhash?: ComponentProps<typeof BlurhashCanvas>['hash'];
  width?: HTMLImageElement['width'];
  height?: HTMLImageElement['height'];
  wrapperClassName?: HTMLDivElement['className'];
  className?: HTMLImageElement['className'];
  customSizeHandling?: boolean;
  wrapperStyle?: HTMLDivElement['style'];
  style?: HTMLImageElement['style'];
  loadLazy?: boolean;
  imgSources?: JSX.Element;
}

// https://codesandbox.io/s/unsplash-image-search-bn3rn?file=/src/modules/main/components/ImageLazyLoad/index.tsx
export default function ImageLazyLoad({
  src,
  alt,
  blurhash,
  width,
  height,
  wrapperClassName,
  className,
  customSizeHandling = false,
  wrapperStyle,
  style,
  loadLazy = false,
  imgSources,
}: ImageLazyLoadProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hideBlur, setHideBlur] = useState(false);

  const [scaledWidth, scaledHeight] = useMemo(() => {
    if (!width || !height) return [undefined, undefined];
    const [w, h] = aspectRatio(width, height);
    // limit w or h to be max 128 and the other to be scaled accordingly (also blurhash doesn't like floats, so round)
    if (w > h) {
      return [128, Math.round((128 / w) * h)];
    }
    return [Math.round((128 / h) * w), 128];
  }, [width, height]);

  const afterLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, [setIsImageLoaded]);

  const placeholder = useMemo(() => {
    if (!blurhash) return <></>;
    return (
      <BlurhashCanvas
        hash={blurhash ? blurhash.replace(/^"+|"+$/g, '') : ''}
        {...(scaledWidth && scaledHeight ? {
          width: scaledWidth,
          height: scaledHeight,
        } : {})}
        className={clsx(className,
          'transition-opacity z-10 absolute inset-0',
          hideBlur ? 'hidden' : 'block',
          isImageLoaded ? 'opacity-0' : 'opacity-100',
          { 'w-full h-full object-cover': !customSizeHandling },
        )}
        style={style}
        onTransitionEnd={(e) => {
          const style = getComputedStyle(e.target);
          if (style.opacity === '0') {
            setHideBlur(true);
          }
        }}
      />
    );
  }, [blurhash, scaledWidth, scaledHeight, hideBlur, isImageLoaded, style, className, setHideBlur]);

  return (
    <div className={clsx(wrapperClassName, 'w-full h-full relative')} style={wrapperStyle}>
      {placeholder}
      <picture>
        {imgSources}
        <img
          src={src}
          alt={alt}
          onLoad={afterLoad} // Doesn't seem to work properly with loading="lazy"
          className={clsx(className,
            { 'hidden': !isImageLoaded },
            'absolute inset-0',
            { 'w-full h-full object-cover': !customSizeHandling },
          )}
          style={style}
          {...(loadLazy ? { loading: 'lazy' } : {})}
        />
      </picture>
    </div>
  );
}
