import {useTranslation} from "react-i18next";
import menu from '/menu.png';
import {Disclosure} from "@headlessui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import QrScannerCheck, {CountdownHandle} from "./QrScannerCheck.tsx";
import {useRef} from "react";

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

  const menuOptions = [
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
  ];

  const qrRef = useRef<CountdownHandle | undefined>(undefined);

  async function handleScan(result) {
    if (!isValidHttpUrl(result.data)) {
      qrRef.current?.showMessage('error', t('homepage.qrScanner.invalid'));
      return;
    }

    const url = new URL(result.data);
    const username = url.searchParams.get('username');
    const password = url.searchParams.get('password');

    qrRef.current?.showMessage('success', t('homepage.qrScanner.loggingIn'));

    // try {
    //   const response = await api.common.login({ username, password });
    //   auth.set({jwt: response.token});
    // } catch (e) {
    //   qrRef.current?.showMessage('error', $t('Login fehlgeschlagen: ') + e?.response?.data?.message);
    //   // throw e
    // }
  }

  // onMount(async () => {
  //   const urlParam = new URLSearchParams(window.location.search);
  //   const username = urlParam.get('username');
  //   const password = urlParam.get('password');
  //   if (username && password) {
  //     try {
  //       const response = await api.common.login({ username, password });
  //       auth.set({jwt: response.token});
  //       await goto('/');
  //     } catch (e) {
  //       // Ignore
  //     }
  //   }
  // });

  return (
    <div className="bg-gradient-to-r from-45% from-red-light to-55% to-red-dark">
      <div className="mx-auto max-w-7xl md:px-6 md:pr-20 lg:px-8 lg:pr-32">
        <div className="bg-red-light">
          <div
            id={id}
            className="flex flex-col md:flex-row-reverse"
          >
            <div className="flex-1">
              <img
                src={menu}
                alt="Bild von Essen"
                className="md:mt-12 md:translate-x-12 w-full md:shadow-[-1rem_1rem_0_0_#403a37]"
              />
            </div>
            <div className="flex-1 m-8 md:mx-0">
              <h2 className="uppercase text-3xl mb-6 philosopher-regular">{t('homepage.menu.title')}</h2>
              <div className="md:hidden">
                {menuOptions.map((item, index) => (
                  <Disclosure
                    as="div"
                    key={item.key}
                    className={clsx('border-b-[1px] border-gray-dark', {'border-t-[1px]': index === 0})}
                  >
                    {({open}) => (
                      <>
                        <Disclosure.Button className="py-2">
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={clsx(
                              'mr-4 transform transition-transform motion-reduce:transition-none',
                              {'rotate-180': open}
                            )}
                          />
                          <span className="text-lg philosopher-regular">{item.title}</span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="whitespace-pre-line ml-8 noto-sans-regular">
                          {item.text}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
              <div className="hidden md:block">
                <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.menu.meat.title')}</h3>
                <p className="whitespace-pre-line noto-sans-regular">{t('homepage.menu.meat.text')}</p>
                <h3 className="text-2xl mb-4 philosopher-regular">{t('homepage.menu.vegetarian.title')}</h3>
                <p className="whitespace-pre-line noto-sans-regular">{t('homepage.menu.vegetarian.text')}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-light md:pt-8">
            <div className="px-8 pb-8">
              <QrScannerCheck
                ref={qrRef}
                onScan={handleScan}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
