import { useTranslation } from 'react-i18next';
import AlignedCard from '#/layout/AlignedCard';
import useGalleryIds from '#/api/invited/gallery/useGalleryIds.ts';
import BigSpinner from '#/layout/BigSpinner.tsx';
import ImageLazyLoad from '#/components/common/ImageLazyLoad.tsx';
import blurHashMap from '#/img/blurhash-map.json';
import image from '#/img/Fotos.jpg';

interface Props {
  id?: string;
}
export default function Gallery({ id }: Props) {
  const { t } = useTranslation('app');

  const galleryFileIds = useGalleryIds();

  let galleryView = <BigSpinner />;

  if (galleryFileIds.data) {
    if (galleryFileIds.data.files.length === 0) {
      galleryView = (
        <p className="text-xl font-noto-sans">
          {t('homepage.gallery.noImages')}
        </p>
      );
    } else {
      galleryView = (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryFileIds.data.files.map((file) => (
            <img
              key={file.id}
              // TODO: eventually use `file.publicUrl`
              src={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${file.id}`}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      );
    }
  }

  if (galleryFileIds.error) {
    galleryView = (
      <p className="text-xl font-noto-sans">
        {t('homepage.gallery.error')}
      </p>
    );
  }

  return (
    <AlignedCard
      id={id}
      image={
        <ImageLazyLoad
          src={image}
          alt="Fotos"
          blurhash={blurHashMap.fotosJpg}
          className="w-full"
          imgSources={(
            <>
              {/*<source srcSet={imageWebp} type="image/webp" />*/}
              <source srcSet={image} type="image/jpeg" />
            </>
          )}
        />}
      topContent={
        <>
          <h2 className="uppercase text-4xl md:text-7xl mb-6 font-philosopher">
            {t('homepage.gallery.title')}
          </h2>
          <p className="whitespace-pre-line md:text-2xl font-noto-sans">
            {t('homepage.gallery.text')}
          </p>
        </>
      }
      bottomContent={galleryView}
      align="right"
      backgroundColor="app-yellow-dark"
      imageShadowColor="app-green-dark"
    />
  );
}
