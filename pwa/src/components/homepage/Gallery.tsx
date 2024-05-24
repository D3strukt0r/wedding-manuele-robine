import { useTranslation } from 'react-i18next';
import gallery from '/img/Fotos.jpg';
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
          <h2 className="uppercase text-4xl md:text-7xl mb-6 font-philosopher">
            {t('homepage.gallery.title')}
          </h2>
          <p className="whitespace-pre-line md:text-2xl font-noto-sans">
            {t('homepage.gallery.text')}
          </p>
        </>
      }
      bottomContent={<></>}
      align="right"
      backgroundColor="app-yellow-dark"
      imageShadowColor="app-green-dark"
    />
  );
}
