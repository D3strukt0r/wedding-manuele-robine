import {useTranslation} from "react-i18next";
import menu from '/menu.png';
import QrScannerCheck, {CountdownHandle} from "./QrScannerCheck.tsx";
import {useCallback, useContext, useRef} from "react";
import AlignedCard from "../../layout/AlignedCard.tsx";
import Collapsible from "../../layout/Collapsible.tsx";
import AuthenticationContext from "../../context/AuthenticationContext.tsx";
import {api} from "../api.ts";
import QrScanner from "qr-scanner";
import {AxiosError} from "axios";

// https://stackoverflow.com/a/43467144/4156752
function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export default function ManuAndSelection({id}: {id?: string}) {
  const {t} = useTranslation('app')

  const qrRef = useRef<CountdownHandle>(null);

  const [authentication, updateAuthentication] = useContext(AuthenticationContext);

  const handleScan = useCallback(async (result: QrScanner.ScanResult) => {
    if (!isValidHttpUrl(result.data)) {
      qrRef.current?.showMessage('error', t('homepage.qrScanner.invalid'));
      return;
    }

    const url = new URL(result.data);
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

    if (!username || !password) {
      qrRef.current?.showMessage('error', t('homepage.qrScanner.noCredentials'));
      return;
    }

    qrRef.current?.showMessage('success', t('homepage.qrScanner.loggingIn'));
    try {
      const response = await api.common.login({ username, password });
      updateAuthentication(response.token);
    } catch (e) {
      // check if type is AxiosError
      if (e instanceof AxiosError) {
        qrRef.current?.showMessage('error', t('homepage.qrScanner.loginFailed', {errorMessage: e.response?.data?.message}));
      } else {
        qrRef.current?.showMessage('error', t('homepage.qrScanner.loginFailed', {errorMessage: e}));
      }
    }
  }, [qrRef, updateAuthentication, t]);

  return (
    <AlignedCard
      id={id}
      image={menu}
      topContent={(
        <>
          <h2 className="uppercase text-3xl mb-6 philosopher-regular">{t('homepage.menu.title')}</h2>
          <div className="md:hidden">
            <Collapsible
              menuOptions={[
                {
                  key: 'meat',
                  title: t('homepage.menu.meat.title'),
                  text: t('homepage.menu.meat.text')
                },
                {
                  key: 'vegetarian',
                  title: t('homepage.menu.vegetarian.title'),
                  text: t('homepage.menu.vegetarian.text')
                }
              ]}
            />
          </div>
          <div className="hidden md:block">
            <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.menu.meat.title')}</h3>
            <p className="whitespace-pre-line noto-sans-regular">{t('homepage.menu.meat.text')}</p>
            <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.menu.vegetarian.title')}</h3>
            <p className="whitespace-pre-line noto-sans-regular">{t('homepage.menu.vegetarian.text')}</p>
          </div>
        </>
      )}
      bottomContent={authentication ? (
        <p>{t('homepage.menu.loggedIn')}</p>
      ) : (
        <QrScannerCheck
          ref={qrRef}
          onScan={handleScan}
        />
      )}
      align="left"
      backgroundColor="red-light"
      imageShadowColor="gray-dark"
    />
  )
}
