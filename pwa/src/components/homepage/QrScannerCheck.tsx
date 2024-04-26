import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import QrScanner from 'qr-scanner';
// import QrCode from "@material-design-icons/svg/outlined/qr_code_scanner.svg?react";
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import QrCode from '#/assets/QrCode';

type MessageType = 'success' | 'error';

const mapMessageTypeToColor: { [key in MessageType]: string } = {
  success: 'bg-green-600/50',
  error: 'bg-red-600/50',
};

let messageDeBouncer: number | undefined;

export interface CountdownHandle {
  showMessage: (type: MessageType, msg: string) => void;
}
interface Props {
  onScan?: (result: QrScanner.ScanResult) => Promise<void>;
}

const QrScannerCheck = forwardRef<CountdownHandle, Props>(({ onScan }, ref) => {
  const { t } = useTranslation('app');

  const qrEnableElemRef = useRef<HTMLDivElement>(null);
  const qrReaderSourceElemRef = useRef<HTMLVideoElement>(null);

  const [cameraUnavailable, setCameraUnavailable] = useState<boolean>(true);
  const [scanInProgress, setScanInProgress] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>('success');

  useImperativeHandle(ref, () => ({
    showMessage: (type: MessageType, msg: string) => {
      setMessageType(type);
      setMessage(msg);
      clearTimeout(messageDeBouncer);
      messageDeBouncer = setTimeout(() => {
        setMessage(null);
      }, 2000);
    },
  }), []);

  let qrScanner: QrScanner | null = null;

  const enableQrClickHandler = async () => {
    if (!qrEnableElemRef.current) return;

    qrEnableElemRef.current.classList.add('disabled');

    if (await QrScanner.hasCamera()) {
      qrScanner = new QrScanner(
        qrReaderSourceElemRef.current!,
        async (result) => {
          if (scanInProgress) {
            return;
          }
          setScanInProgress(true);

          setMessage(null);

          try {
            await onScan?.(result);
          } finally {
            setScanInProgress(false);
          }
        },
        {
          preferredCamera: 'environment',
          maxScansPerSecond: 2,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
        },
      );

      setCameraUnavailable(false);
      await qrScanner.start();
    } else {
      setCameraUnavailable(true);
    }
  };

  useEffect(() => () => {
    if (qrScanner) {
      qrScanner.destroy();
      qrScanner = null;
    }
  }, []);

  return (
    <div className="border-2 border-gray-300 bg-gray-200">
      <div
        ref={qrEnableElemRef}
        className={clsx('flex flex-col items-center p-8', {
          hidden: !cameraUnavailable,
        })}
      >
        {/* <QrCode className="mb-8 my-4 h-20 w-20" /> */}
        <div className="mb-8 my-4 w-20">
          <QrCode />
        </div>
        <button
          type="button"
          className="bg-green-600 px-3.5 py-2.5 font-semibold text-white hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={enableQrClickHandler}
        >
          {t('homepage.qrScanner.activateCamera')}
        </button>
      </div>
      <div className="relative">
        <div
          className={clsx(
            'absolute inset-0 flex justify-center items-center text-white text-xl font-bold z-10',
            'opacity-0 transition-opacity motion-reduce:transition-none',
            mapMessageTypeToColor[messageType],
            { '!opacity-100': message !== null },
          )}
        >
          {message ?? ''}
        </div>
        <video
          ref={qrReaderSourceElemRef}
          className={`!w-full ${cameraUnavailable ? 'hidden' : 'block'}`}
        />
      </div>
    </div>
  );
});

export default QrScannerCheck;
