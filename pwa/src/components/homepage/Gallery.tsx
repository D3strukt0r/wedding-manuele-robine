import { useTranslation } from 'react-i18next';
import AlignedCard from '#/layout/AlignedCard';
import useGalleryIds from '#/api/invited/gallery/useGalleryIds.ts';
import BigSpinner from '#/layout/BigSpinner.tsx';
import ImageLazyLoad, { aspectRatio } from '#/components/common/ImageLazyLoad.tsx';
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
          {galleryFileIds.data.files.map((file) => {
            const isOptimized = file.children.length > 0;
            // extract the main image possibly a jpg mimetype from the optimized images
            const mainImage = isOptimized
              ? (file.children.find((child) => child.mimeType === 'image/jpeg') ?? file)
              : file;
            // ... and the webp image as the first source
            const imageWebp = isOptimized
              ? (file.children.find((child) => child.mimeType === 'image/webp') ?? null)
              : null;
            // ... extract those two and use them as the other sources
            const otherSources = isOptimized
              ? file.children.filter((child) => ![mainImage.id, imageWebp?.id].filter(Boolean).includes(child.id))
              : [];

            const [width, height] = aspectRatio(mainImage.width, mainImage.height);

            return (
              <ImageLazyLoad
                key={file.id}
                // TODO: eventually use `file.publicUrl`
                src={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${mainImage.id}`}
                width={mainImage.width}
                height={mainImage.height}
                customSizeHandling
                className="w-full"
                wrapperStyle={{ aspectRatio: `${width}/${height}` }}
                blurhash={mainImage.blurhash}
                imgSources={(
                  <>
                    {imageWebp && (
                      <source srcSet={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${imageWebp.id}`} type="image/webp" />
                    )}
                    {otherSources.map((source) => (
                      <source key={source.id} srcSet={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${source.id}`} type={source.mimeType} />
                    ))}
                  </>
                )}
              />
            )
          })}
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
