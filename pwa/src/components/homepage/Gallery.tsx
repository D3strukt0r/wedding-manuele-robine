import { useTranslation } from 'react-i18next';
import gallery from '/img/gallery.jpeg';
import AlignedCard from '#/layout/AlignedCard';

interface Props {
  id?: string;
}
export default function Gallery({ id }: Props) {
  const { t } = useTranslation('app');

  return (
    <AlignedCard
      id={id}
      image={gallery}
      topContent={
        <>
          <h2 className="uppercase text-4xl md:text-7xl mb-6 philosopher-regular">
            {t('homepage.gallery.title')}
          </h2>
          <p className="whitespace-pre-line md:text-2xl noto-sans-regular">
            {t('homepage.gallery.text')}
          </p>
        </>
      }
      bottomContent={<></>}
      align="right"
      backgroundColor="app-red-light"
      imageShadowColor="white"
    />
  );
}
