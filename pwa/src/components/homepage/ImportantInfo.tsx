import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import infos from '/img/Infos.jpg';
import AlignedCard from '#/layout/AlignedCard';
import Collapsible from '#/layout/Collapsible';

interface Props {
  id?: string;
}
export default function ImportantInfo({ id }: Props) {
  const { t } = useTranslation('app');

  return (
    <AlignedCard
      id={id}
      image={infos}
      topContent={
        <>
          <h2 className="uppercase text-4xl md:text-7xl mb-6 philosopher-regular">
            {t('homepage.info.title')}
          </h2>
          <p className="whitespace-pre-line noto-sans-regular md:text-2xl">
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
                  title: <span className="text-xl">{t('homepage.info.dresscode.title')}</span>,
                  text: t('homepage.info.dresscode.text'),
                },
                {
                  key: 'gifts',
                  title: <span className="text-xl">{t('homepage.info.gifts.title')}</span>,
                  text: t('homepage.info.gifts.text'),
                },
                {
                  key: 'games',
                  title: <span className="text-xl">{t('homepage.info.games.title')}</span>,
                  text: <Markup content={t('homepage.info.games.text')} />,
                },
              ]}
            />
          </div>
          <div className="hidden md:grid grid-rows-2 grid-flow-col gap-8">
            <div>
              <h3 className="text-xl md:text-4xl mb-4 philosopher-regular">
                {t('homepage.info.dresscode.title')}
              </h3>
              <p className="whitespace-pre-line md:text-2xl noto-sans-regular">
                {t('homepage.info.dresscode.text')}
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-4xl mb-4 philosopher-regular">
                {t('homepage.info.gifts.title')}
              </h3>
              <p className="whitespace-pre-line md:text-2xl noto-sans-regular">
                {t('homepage.info.gifts.text')}
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-4xl mb-4 philosopher-regular">
                {t('homepage.info.games.title')}
              </h3>
              <p className="whitespace-pre-line md:text-2xl noto-sans-regular">
                <Markup content={t('homepage.info.games.text')} />
              </p>
            </div>
          </div>
        </>
      }
      align="left"
      backgroundColor="white"
      imageShadowColor="app-gray-dark"
    />
  );
}
