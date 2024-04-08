import {useTranslation} from "react-i18next";
import infos from '/infos.png';
import AlignedCard from "../../layout/AlignedCard.tsx";
import Collapsible from "../../layout/Collapsible.tsx";
import {Markup} from 'interweave';

export default function ImportantInfo({id}: {id?: string}) {
  const {t} = useTranslation('app')

  return (
    <AlignedCard
      id={id}
      image={infos}
      topContent={(
        <>
          <h2 className="uppercase text-3xl mb-6 philosopher-regular">{t('homepage.info.title')}</h2>
          <p className="whitespace-pre-line noto-sans-regular">{t('homepage.info.date')}</p>
        </>
      )}
      bottomContent={(
        <>
          <div className="md:hidden">
            <Collapsible
              menuOptions={[
                {
                  key: 'dresscode',
                  title: t('homepage.info.dresscode.title'),
                  text: t('homepage.info.dresscode.text')
                },
                {
                  key: 'gifts',
                  title: t('homepage.info.gifts.title'),
                  text: t('homepage.info.gifts.text')
                },
                {
                  key: 'games',
                  title: t('homepage.info.games.title'),
                  text: <Markup content={t('homepage.info.games.text')} />
                }
              ]}
            />
          </div>
          <div className="hidden md:grid grid-rows-2 grid-flow-col gap-8">
            <div>
              <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.info.dresscode.title')}</h3>
              <p className="whitespace-pre-line noto-sans-regular">{t('homepage.info.dresscode.text')}</p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.info.gifts.title')}</h3>
              <p className="whitespace-pre-line noto-sans-regular">{t('homepage.info.gifts.text')}</p>
            </div>
            <div>
              <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.info.games.title')}</h3>
              <p className="whitespace-pre-line noto-sans-regular">
                <Markup content={t('homepage.info.games.text')} />
              </p>
            </div>
          </div>
        </>
      )}
      align="left"
      backgroundColor="white"
      imageShadowColor="gray-dark"
    />
  )
}
