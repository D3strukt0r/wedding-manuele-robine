import { useTranslation } from 'react-i18next';
import header from '/img/header.png';

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
        <img
          src={header}
          alt="Bild von Manuele & Robine"
          className="w-full md:shadow-[-1rem_1rem_0_0_#dab4a7]"
        />
        <h2 className="absolute bottom-0 text-gray-50 uppercase text-3xl mx-8 mb-6 md:hidden philosopher-regular">
          {t('homepage.howToWedding.title1')}
        </h2>
      </div>
      <div className="flex-1 px-8 md:pl-0 py-8 md:mr-16 md:mt-12">
        <h2 className="text-gray-50 uppercase text-3xl mb-6 hidden md:block philosopher-regular">
          {t('homepage.howToWedding.title1')}
        </h2>
        <h2 className="text-gray-50 uppercase text-3xl mb-6 md:hidden philosopher-regular">
          {t('homepage.howToWedding.title2')}
        </h2>
        <p className="whitespace-pre-line text-gray-50 noto-sans-regular">
          {t('homepage.howToWedding.text')}
        </p>
      </div>
    </div>
  );
}
