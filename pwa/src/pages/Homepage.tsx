import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import NavBar from '#/layout/NavBar';
import Logo from '#/assets/Logo';
import HowToWedding from '#/components/homepage/HowToWedding';
import MenuAndSelection from '#/components/homepage/MenuAndSelection';
import MapAndPlan from '#/components/homepage/MapAndPlan';
import ImportantInfo from '#/components/homepage/ImportantInfo';
import Gallery from '#/components/homepage/Gallery';

export default function Homepage() {
  const { t } = useTranslation('app');

  return (
    <>
      <Helmet>
        <body className="bg-app-green app" />
      </Helmet>
      <NavBar
        logo={<Logo mode="dark" />}
        menuItems={[
          {
            label: t('menu.howTo'),
            route: '#how-to',
          },
          {
            label: t('menu.menu'),
            route: '#menu',
          },
          {
            label: t('menu.address'),
            route: '#address',
          },
          {
            label: t('menu.process'),
            route: '#process',
          },
          {
            label: t('menu.importantInfo'),
            route: '#important-info',
          },
          {
            label: t('menu.gallery'),
            route: '#gallery',
          },
        ]}
      />
      <article>
        <section className="md:pb-16 md:mt-20">
          <HowToWedding id="how-to" />
        </section>
        <section className="md:pb-16">
          <MenuAndSelection id="menu" />
        </section>
        <section className="md:pb-16">
          <MapAndPlan id="address" id2="process" />
        </section>
        <section className="md:pb-16">
          <ImportantInfo id="important-info" />
        </section>
        <section className="md:pb-16">
          <Gallery id="gallery" />
        </section>
      </article>
      <footer className="bg-app-gray-dark text-white">
        <p className="text-center whitespace-pre-line py-4 text-sm">
          {t('footer.copyright', {year: new Date().getFullYear()})}
        </p>
      </footer>
    </>
  );
}
