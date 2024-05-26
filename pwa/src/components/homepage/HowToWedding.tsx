import { useTranslation } from 'react-i18next';
import ImageLazyLoad from '#/components/common/ImageLazyLoad.tsx';
import image from '#/img/Portrait.jpg';
import blurHashMap from '#/img/blurhash-map.json';

interface Props {
  id?: string;
}
export default function HowToWedding({ id }: Props) {
  const { t } = useTranslation('app');

  return (
    <div
      id={id}
      className="mx-auto max-w-7xl md:px-6 lg:px-8 flex flex-col md:flex-row-reverse"
    >
      <div className="flex-1 relative">
        <ImageLazyLoad
          src={image}
          alt="Portrait von Manuele & Robine"
          blurhash={blurHashMap.portraitJpg}
          className="md:shadow-[-1rem_1rem_0_0_#faffe4]"
          imgSources={<source srcSet={image} type="image/jpeg" />}
        />
        <h2 className="absolute bottom-0 text-gray-50 uppercase text-title mx-8 mb-6 md:hidden font-philosopher">
          {t('homepage.howToWedding.title1')}
        </h2>
      </div>
      <div className="flex-1 px-8 md:pl-0 py-8 md:mr-16 md:mt-12">
        <h2 className="text-gray-50 uppercase text-title mb-6 hidden md:block font-philosopher">
          {t('homepage.howToWedding.title1')}
        </h2>
        <h2 className="text-gray-50 uppercase text-title mb-6 md:hidden font-philosopher">
          {t('homepage.howToWedding.title2')}
        </h2>
        <p className="whitespace-pre-line text-normal text-gray-50 font-noto-sans">
          {t('homepage.howToWedding.text')}
        </p>
      </div>
    </div>
  );
}
