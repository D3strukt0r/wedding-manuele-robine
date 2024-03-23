import NavBar from "../layout/NavBar.tsx";
import Logo from "../assets/Logo.tsx";
import {useTranslation} from "react-i18next";
import HowToWedding from "../components/homepage/HowToWedding.tsx";
import MenuAndSelection from "../components/homepage/MenuAndSelection.tsx";
import MapAndPlan from "../components/homepage/MapAndPlan.tsx";
import ImportantInfo from "../components/homepage/ImportantInfo.tsx";
import Gallery from "../components/homepage/Gallery.tsx";

export default function Homepage() {
  const {t} = useTranslation("app")

  return (
    <>
      <NavBar
        logo={<Logo mode="dark" />}
        menuItems={[
          {
            label: t('menu.howTo'),
            route: '#how-to'
          },
          {
            label: t('menu.menu'),
            route: '#menu'
          },
          {
            label: t('menu.address'),
            route: '#address'
          },
          {
            label: t('menu.process'),
            route: '#address'
          },
          {
            label: t('menu.importantInfo'),
            route: '#important-info'
          },
          {
            label: t('menu.gallery'),
            route: '#gallery'
          }
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
      <footer className="bg-gray-dark text-white">
        <p className="text-center whitespace-pre-line py-4 text-sm">{t('footer.copyright')}</p>
      </footer>
    </>
  );
}
