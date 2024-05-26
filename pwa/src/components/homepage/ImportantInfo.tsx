import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import AlignedCard from '#/layout/AlignedCard';
import Collapsible from '#/layout/Collapsible';
import ImageLazyLoad from '#/components/common/ImageLazyLoad.tsx';
import image from '#/img/Infos.jpg';
import blurHashMap from '#/img/blurhash-map.json';

interface Props {
  id?: string;
}
export default function ImportantInfo({ id }: Props) {
  const { t } = useTranslation('app');

  return (
    <AlignedCard
      id={id}
      image={
        <ImageLazyLoad
          src={image}
          alt="Infos"
          blurhash={blurHashMap.infosJpg}
          imgSources={<source srcSet={image} type="image/jpeg" />}
        />
      }
      topContent={
        <>
          <h2 className="uppercase text-title mb-6 font-philosopher">
            {t('homepage.info.title')}
          </h2>
          <p className="whitespace-pre-line font-noto-sans text-normal">
            {t('homepage.info.date')}
          </p>
        </>
      }
      bottomContent={
        <>
          <div className="md:hidden">
            <Collapsible
              menuOptions={[
                {
                  key: 'dresscode',
                  title: <span className="text-subtitle">{t('homepage.info.dresscode.title')}</span>,
                  text: t('homepage.info.dresscode.text'),
                },
                {
                  key: 'gifts',
                  title: <span className="text-subtitle">{t('homepage.info.gifts.title')}</span>,
                  text: t('homepage.info.gifts.text'),
                },
                {
                  key: 'games',
                  title: <span className="text-subtitle">{t('homepage.info.games.title')}</span>,
                  text: <Markup content={t('homepage.info.games.text')} />,
                },
              ]}
            />
          </div>
          <div className="hidden md:grid grid-rows-2 grid-flow-col gap-8">
            <div>
              <h3 className="text-subtitle mb-4 font-philosopher">
                {t('homepage.info.dresscode.title')}
              </h3>
              <p className="whitespace-pre-line text-normal font-noto-sans">
                {t('homepage.info.dresscode.text')}
              </p>
            </div>
            <div>
              <h3 className="text-subtitle mb-4 font-philosopher">
                {t('homepage.info.gifts.title')}
              </h3>
              <p className="whitespace-pre-line text-normal font-noto-sans">
                {t('homepage.info.gifts.text')}
              </p>
            </div>
            <div>
              <h3 className="text-subtitle mb-4 font-philosopher">
                {t('homepage.info.games.title')}
              </h3>
              <p className="whitespace-pre-line text-normal font-noto-sans">
                <Markup content={t('homepage.info.games.text')} />
              </p>
            </div>
          </div>
        </>
      }
      align="left"
      backgroundColor="app-gray-light"
      imageShadowColor="app-yellow-dark"
    />
  );
}
