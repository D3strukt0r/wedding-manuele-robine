import { useTranslation } from 'react-i18next';
import ForkAndKnife from '@material-design-icons/svg/outlined/restaurant.svg?react';
import Drink from '@material-design-icons/svg/outlined/local_bar.svg?react';
import Heart from '@material-design-icons/svg/outlined/favorite_border.svg?react';
import Note from '@material-design-icons/svg/outlined/music_note.svg?react';
import Moon from '@material-design-icons/svg/outlined/bedtime.svg?react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Timeline from '#/layout/Timeline';
import AlignedCard from '#/layout/AlignedCard';

interface Props {
  id?: string;
  id2?: string;
}
export default function MapAndPlan({ id, id2 }: Props) {
  const { t } = useTranslation('app');

  const position = { lat: 47.5867275, lng: 7.696703 };

  // Map ID: https://console.cloud.google.com/google/maps-apis/studio/maps
  return (
    <AlignedCard
      id={id}
      image={
        <Map defaultCenter={position} defaultZoom={17} mapId="7035e553f3676d1e" gestureHandling="cooperative">
          <AdvancedMarker position={position} />
        </Map>
      }
      topContent={
        <>
          <h2 className="uppercase text-title mb-6 font-philosopher">
            {t('homepage.map.title1')}
          </h2>
          <p className="whitespace-pre-line font-philosopher mb-4 text-subtitle">
            {t('homepage.map.address')}
          </p>
          <p className="font-noto-sans text-normal md:max-w-prose">{t('homepage.map.addressInfo')}</p>
        </>
      }
      bottomContent={
        <>
          <h2 id={id2} className="uppercase text-title mb-6 font-philosopher scroll-mt-28">
            {t('homepage.map.title2')}
          </h2>
          <p className="font-noto-sans text-normal mb-8 md:max-w-prose">{t('homepage.map.plan')}</p>
          <Timeline
            points={[
              {
                key: 'trauung',
                text: (
                  <>
                    <time className="font-philosopher text-subtitle inline mr-2 md:block">
                      {t('homepage.map.plan.1.time')}
                    </time>
                    <p className="font-philosopher text-subtitle inline md:block">
                      <Heart
                        className="inline mr-2 text-white fill-current"
                        aria-hidden="true"
                      />
                      {t('homepage.map.plan.1.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'apero',
                text: (
                  <>
                    <time className="font-philosopher text-subtitle inline mr-2 md:block">
                      {t('homepage.map.plan.2.time')}
                    </time>
                    <p className="font-philosopher text-subtitle inline md:block">
                      <Drink
                        className="inline mr-2 text-white fill-current"
                        aria-hidden="true"
                      />
                      {t('homepage.map.plan.2.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'essen',
                text: (
                  <>
                    <time className="font-philosopher text-subtitle inline mr-2 md:block">
                      {t('homepage.map.plan.3.time')}
                    </time>
                    <p className="font-philosopher text-subtitle inline md:block">
                      <ForkAndKnife
                        className="inline mr-2 text-white fill-current"
                        aria-hidden="true"
                      />
                      {t('homepage.map.plan.3.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'party',
                text: (
                  <>
                    <time className="font-philosopher text-subtitle inline mr-2 md:block">
                      {t('homepage.map.plan.4.time')}
                    </time>
                    <p className="font-philosopher text-subtitle inline md:block">
                      <Note
                        className="inline mr-2 text-white fill-current"
                        aria-hidden="true"
                      />
                      {t('homepage.map.plan.4.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'abschluss',
                text: (
                  <>
                    <time className="font-philosopher text-subtitle inline mr-2 md:block">
                      {t('homepage.map.plan.5.time')}
                    </time>
                    <p className="font-philosopher text-subtitle inline md:block">
                      <Moon
                        className="inline mr-2 text-white fill-current"
                        aria-hidden="true"
                      />
                      {t('homepage.map.plan.5.text')}
                    </p>
                  </>
                ),
              },
            ]}
          />
        </>
      }
      align="right"
      backgroundColor="app-green-dark"
      imageShadowColor="app-gray-light"
    />
  );
}
