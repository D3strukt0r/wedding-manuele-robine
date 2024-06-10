import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { forwardRef, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form';
import { InternalFieldName } from 'react-hook-form/dist/types/fields';
import { useTranslation } from 'react-i18next';

const mimeTypeMapping = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/bmp': 'BMP',
  'image/png': 'PNG',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'text/csv': 'CSV',
};

function mimeTypesToExtensions(mimeTypes: (keyof typeof mimeTypeMapping)[]) {
  return mimeTypes.
    map((type) => mimeTypeMapping[type]).
    filter((x) => x) as string[];
}

export function bytesToHumanReadableFileSize(bytes: number, decimalPlaces = 0, sizes = ['B', 'KiB', 'MiB', 'GiB']) {
  if (bytes === 0) {
    return '0 B';
  }

  const baseLog = 1024;
  const magnitude = Math.min(Math.floor(Math.log(bytes) / Math.log(baseLog)), sizes.length - 1);

  return `${Number.parseFloat((bytes / (baseLog ** magnitude)).toString()).toFixed(decimalPlaces)} ${sizes[magnitude]}`;
}

type Props<TFieldName extends InternalFieldName = InternalFieldName> = UseFormRegisterReturn<TFieldName> & {
  label?: ReactNode;
  allowedFileTypes?: (keyof typeof mimeTypeMapping)[];
  allowedFileSize?: number; // in bytes
}
const UploadDragger = forwardRef<HTMLInputElement, Props>(({
  label,
  allowedFileTypes,
  allowedFileSize = 100 * 1024 * 1024,
  onChange,
  value,
  ...props
}, ref) => {
  const { t } = useTranslation('app');

  return (
    <div className="col-span-full">
      {label && (
        <label htmlFor={`${props.name}-label2`} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor={props.name}
              className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>{t('common.upload.file')}</span>
              <input ref={ref} id={props.name} {...props} type="file" className="sr-only" />
            </label>
            <p className="pl-1">{t('common.upload.orDrop')}</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {t('common.upload.restrictions', {
              types: mimeTypesToExtensions(allowedFileTypes).join(', '),
              size: bytesToHumanReadableFileSize(allowedFileSize),
            })}
          </p>
        </div>
      </div>
    </div>
  )
});

export default UploadDragger;
