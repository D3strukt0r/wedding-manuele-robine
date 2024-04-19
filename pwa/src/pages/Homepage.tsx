import { useTranslation } from 'react-i18next';
import NavBar from '../layout/NavBar';
import Logo from '../assets/Logo';
import HowToWedding from '../components/homepage/HowToWedding';
import MenuAndSelection from '../components/homepage/MenuAndSelection';
import MapAndPlan from '../components/homepage/MapAndPlan';
import ImportantInfo from '../components/homepage/ImportantInfo';
import Gallery from '../components/homepage/Gallery';

export default function Homepage() {
  const { t } = useTranslation('app');

  return (
    <>
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
            route: '#address',
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
      <div className="md:pb-16">
        <HowToWedding id="how-to" />
      </div>
      <div className="md:pb-16">
        <MenuAndSelection id="menu" />
      </div>
      <div className="md:pb-16">
        <MapAndPlan id="address" />
      </div>
      <div className="md:pb-16">
        <ImportantInfo id="important-info" />
      </div>
      <div className="md:pb-16">
        <Gallery id="gallery" />
      </div>
      <footer className="bg-app-gray-dark text-white">
        <p className="text-center whitespace-pre-line py-4 text-sm">
          {t('footer.copyright')}
        </p>
      </footer>
    </>
  );
}
