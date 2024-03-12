import header from '/header.png';
import {useTranslation} from "react-i18next";

export default function HowToWedding({id}: {id?: string}) {
  const {t} = useTranslation('app')

  return (
    <div id={id} className="flex flex-col md:flex-row-reverse bg-red-dark md:pb-16">
      <div className="flex-1 relative">
        <img src={header} alt="Bild von Manuele & Robine" className="w-full md:shadow-[-1rem_1rem_0_0_#dab4a7]" />
        <h2 className="absolute bottom-0 text-gray-50 uppercase text-3xl mx-10 mb-6 md:hidden">{t('homepage.howToWedding.title1')}</h2>
      </div>
      <div className="flex-1 px-4 py-8 md:mr-16 md:mt-12">
        <h2 className="text-gray-50 uppercase text-3xl mb-6 hidden md:block">{t('homepage.howToWedding.title1')}</h2>
        <h2 className="text-gray-50 uppercase text-3xl mb-6 md:hidden">{t('homepage.howToWedding.title2')}</h2>
        <p className="whitespace-pre-line text-gray-50">{t('homepage.howToWedding.text')}</p>
      </div>
    </div>
  )
}
