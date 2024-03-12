import NavBar from "../layout/NavBar.tsx";
import Logo from "../assets/Logo.tsx";
import {useTranslation} from "react-i18next";
import HowToWedding from "../components/homepage/HowToWedding.tsx";
import MenuAndSelection from "../components/homepage/MenuAndSelection.tsx";

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
            route: '#process'
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
      <HowToWedding id="how-to" />
      <MenuAndSelection id="menu" />
    </>
  );
}
