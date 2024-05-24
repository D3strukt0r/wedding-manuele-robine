import { ComponentProps, useCallback, useMemo, useState } from 'react';
import {BlurhashCanvas} from 'react-blurhash';
import clsx from 'clsx';

export interface ImageLazyLoadProps {
  src?: HTMLImageElement['src'];
  alt?: HTMLImageElement['alt'];
  blurHash?: ComponentProps<typeof BlurhashCanvas>['hash'];
  className?: HTMLImageElement['className'];
  loadLazy?: boolean;
  imgSources?: JSX.Element;
}

// https://codesandbox.io/s/unsplash-image-search-bn3rn?file=/src/modules/main/components/ImageLazyLoad/index.tsx
export default function ImageLazyLoad({src, alt, blurHash, className, loadLazy = false, imgSources}: ImageLazyLoadProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hideBlur, setHideBlur] = useState(false);

  const afterLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, [setIsImageLoaded]);

  const placeholder = useMemo(() => {
    if (!blurHash) return <></>;
    return (
      <BlurhashCanvas
        hash={blurHash ? blurHash.replace(/^"+|"+$/g, '') : ''}
        width={32}
        height={32}
        className={clsx('blurhash', className)}
        style={{
          display: hideBlur ? 'none' : 'block',
          opacity: !isImageLoaded ? 1 : 0,
        }}
        onTransitionEnd={(e) => {
          const style = getComputedStyle(e.target);
          if (style.opacity === '0') {
            setHideBlur(true);
          }
        }}
      />
    );
  }, [isImageLoaded, blurHash, hideBlur, className, setHideBlur]);

  return (
    <div className="img-lazy">
      {placeholder}
      <picture>
        {imgSources}
        <img
          src={src}
          alt={alt}
          onLoad={afterLoad} // Doesn't seem to work properly with loading="lazy"
          className={clsx({'hidden': !isImageLoaded}, className)}
          {...(loadLazy ? {loading: 'lazy'} : {})}
        />
      </picture>
    </div>
  );
}
