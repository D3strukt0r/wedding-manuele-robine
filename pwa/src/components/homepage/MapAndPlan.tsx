import {useTranslation} from "react-i18next";
import map from '/map.png';
import AlignedCard from "../../layout/AlignedCard.tsx";
import Timeline from "../../layout/Timeline.tsx";
import ForkAndKnife from '../../assets/ForkAndKnife';
import Drink from "../../assets/Drink.tsx";
import Heart from "../../assets/Heart.tsx";
import Note from "../../assets/Note.tsx";
import Moon from "../../assets/Moon.tsx";

export default function MapAndPlan({id}: {id?: string}) {
  const {t} = useTranslation('app')

  return (
    <AlignedCard
      id={id}
      image={map}
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
                      <Heart className="h-4 inline mr-2" />
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
                    <Drink className="h-4 inline mr-2" />
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
                    <ForkAndKnife className="h-4 inline mr-2" />
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
                      <Note className="h-4 inline mr-2" />
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
                      <Moon className="h-4 inline mr-2" />
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
