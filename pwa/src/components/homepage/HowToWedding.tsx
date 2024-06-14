import { useTranslation } from 'react-i18next';
import ImageLazyLoad from '#/components/common/ImageLazyLoad.tsx';
import image from '#/img/Portrait.jpg';
import blurHashMap from '#/img/blurhash-map.json';
import { Markup } from 'interweave';

interface Props {
  id?: string;
}
export default function HowToWedding({ id }: Props) {
  const { t } = useTranslation('app');

  return (
    <div
      id={id}
      className="mx-auto max-w-7xl flex flex-col xl:flex-row-reverse scroll-mt-16"
    >
      <div className="flex-1 lg:flex lg:flex-row-reverse relative">
        <ImageLazyLoad
          src={image}
          alt="Portrait von Manuele & Robine"
          blurhash={blurHashMap.portraitJpg}
          className="lg:shadow-[-1rem_1rem_0_0_#faffe4]"
          wrapperClassName="sm:ml-auto h-screen sm:h-[40rem] xl:h-full sm:min-w-[30rem] sm:max-w-[30rem] xl:w-full"
          imgSources={<source srcSet={image} type="image/jpeg" />}
        />
        <h2 className="absolute lg:static bottom-0 text-gray-50 uppercase text-title mx-8 mb-6 lg:mt-auto xl:hidden font-philosopher">
          {t('homepage.howToWedding.titleAdventure')}
        </h2>
      </div>
      <div className="flex-1 px-8 md:px-6 lg:px-8 py-8 md:mr-16 md:mt-12">
        <h2 className="text-gray-50 uppercase text-title mb-6 hidden xl:block font-philosopher">
          {t('homepage.howToWedding.titleAdventure')}
        </h2>
        <h2 className="text-gray-50 uppercase text-title mb-6 sm:hidden font-philosopher">
          {t('homepage.howToWedding.titleHowTo')}
        </h2>
        <p className="whitespace-pre-line text-normal text-gray-50 font-noto-sans">
          <Markup noWrap content={t('homepage.howToWedding.text')} />
        </p>
      </div>
    </div>
  );
}
