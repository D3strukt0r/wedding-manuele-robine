import {useTranslation} from "react-i18next";
import map from '/map.png';
import AlignedCard from "../../layout/AlignedCard.tsx";

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
          <p className="noto-sans-regular">{t('homepage.map.plan')}</p>
        </>
      )}
      align="right"
      backgroundColor="gray-dark"
      imageShadowColor="red-light"
    />
  )
}
