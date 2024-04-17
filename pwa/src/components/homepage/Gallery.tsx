import {useTranslation} from "react-i18next";
import gallery from '/gallery.jpeg';
import AlignedCard from "../../layout/AlignedCard.tsx";

export default function Gallery({id}: {id?: string}) {
  const {t} = useTranslation('app')

  return (
    <AlignedCard
      id={id}
      image={gallery}
      topContent={(
        <>
          <h2 className="uppercase text-3xl mb-6 philosopher-regular">{t('homepage.gallery.title')}</h2>
          <p className="whitespace-pre-line noto-sans-regular">{t('homepage.gallery.text')}</p>
        </>
      )}
      bottomContent={(
        <>
        </>
      )}
      align="right"
      backgroundColor="app-red-light"
      imageShadowColor="white"
    />
  )
}
