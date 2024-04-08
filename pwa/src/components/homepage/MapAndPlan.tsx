import {useTranslation} from "react-i18next";
import AlignedCard from "../../layout/AlignedCard.tsx";
import Timeline from "../../layout/Timeline.tsx";
import ForkAndKnife from '@material-design-icons/svg/outlined/restaurant.svg?react';
import Drink from "@material-design-icons/svg/outlined/local_bar.svg?react";
import Heart from "@material-design-icons/svg/outlined/favorite_border.svg?react";
import Note from "@material-design-icons/svg/outlined/music_note.svg?react";
import Moon from "@material-design-icons/svg/outlined/bedtime.svg?react";
import {Map, AdvancedMarker} from "@vis.gl/react-google-maps";

export default function MapAndPlan({id}: {id?: string}) {
  const {t} = useTranslation('app')

  const position = {lat: 47.5867275, lng: 7.696703};

  // Map ID: https://console.cloud.google.com/google/maps-apis/studio/maps
  return (
    <AlignedCard
      id={id}
      image={(
        <Map defaultCenter={position} defaultZoom={17} mapId="7035e553f3676d1e">
          <AdvancedMarker position={position} />
        </Map>
      )}
      topContent={(
        <>
          <h2 className="uppercase text-3xl mb-6 philosopher-regular">{t('homepage.map.title1')}</h2>
          <p className="whitespace-pre-line philosopher-regular mb-4">{t('homepage.map.address')}</p>
          <p className="noto-sans-regular">{t('homepage.map.addressInfo')}</p>
        </>
      )}
      bottomContent={(
        <>
          <h2 className="uppercase text-3xl mb-6 philosopher-regular">{t('homepage.map.title2')}</h2>
          <p className="noto-sans-regular mb-8">{t('homepage.map.plan')}</p>
          <Timeline
            points={[
              {
                key: 'trauung',
                text: (
                  <>
                    <time className="philosopher-regular inline mr-2 md:block">{t('homepage.map.plan.1.time')}</time>
                    <p className="philosopher-regular inline md:block">
                      <Heart className="inline mr-2 text-white fill-current" aria-hidden="true" />
                      {t('homepage.map.plan.1.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'apero',
                text: (
                  <>
                    <time className="philosopher-regular inline mr-2 md:block">{t('homepage.map.plan.2.time')}</time>
                    <p className="philosopher-regular inline md:block">
                      <Drink className="inline mr-2 text-white fill-current" aria-hidden="true" />
                      {t('homepage.map.plan.2.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'essen',
                text: (
                  <>
                    <time className="philosopher-regular inline mr-2 md:block">{t('homepage.map.plan.3.time')}</time>
                    <p className="philosopher-regular inline md:block">
                      <ForkAndKnife className="inline mr-2 text-white fill-current" aria-hidden="true" />
                      {t('homepage.map.plan.3.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'party',
                text: (
                  <>
                    <time className="philosopher-regular inline mr-2 md:block">{t('homepage.map.plan.4.time')}</time>
                    <p className="philosopher-regular inline md:block">
                      <Note className="inline mr-2 text-white fill-current" aria-hidden="true" />
                      {t('homepage.map.plan.4.text')}
                    </p>
                  </>
                ),
              },
              {
                key: 'abschluss',
                text: (
                  <>
                    <time className="philosopher-regular inline mr-2 md:block">{t('homepage.map.plan.5.time')}</time>
                    <p className="philosopher-regular inline md:block">
                      <Moon className="inline mr-2 text-white fill-current" aria-hidden="true" />
                      {t('homepage.map.plan.5.text')}
                    </p>
                  </>
                ),
              },
            ]}
          />
        </>
      )}
      align="right"
      backgroundColor="gray-dark"
      imageShadowColor="red-light"
    />
  )
}
