import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faUpload } from '@fortawesome/free-solid-svg-icons';
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form/dist/types/form';
import { InternalFieldName } from 'react-hook-form/dist/types/fields';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone'
import { Transition } from '@headlessui/react';
import useUploadFile from '#/api/common/file/useUploadFile.ts';
import { useController, UseControllerProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
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

interface Props<TFieldValues extends FieldValues = FieldValues> extends UseControllerProps<TFieldValues> {
  label?: ReactNode;
  disabled?: boolean;
  allowedFileTypes?: (keyof typeof mimeTypeMapping)[];
  allowedFileSize?: number; // in bytes
}
const UploadDragger = forwardRef<HTMLInputElement, Props>(({
  label,
  disabled,
  allowedFileTypes,
  allowedFileSize = 100 * 1024 * 1024,
  control,
  name,
}, ref) => {
  const { t } = useTranslation('app');
  const { field } = useController({ control, name });
  const [fileIds, setFileIds] = useState(field.value as number[]);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } = useDropzone({
    ...(allowedFileTypes ? {
      accept: allowedFileTypes?.reduce((acc, type) => {
        acc[type] = [];
        return acc;
      }, {} as Record<keyof typeof mimeTypeMapping, string[]>),
    } : {}),
    ...(disabled ? { disabled: disabled || loading } : {}),
    ...(allowedFileSize ? { maxSize: allowedFileSize } : {})
  });

  const { mutateAsync, isPending, isError, error } = useUploadFile({
    onSuccess: (data) => {
      const newFiles = [...fileIds, data.id].filter((x) => x);
      setFileIds(newFiles);
      field.onChange(newFiles);
    },
  });
  useEffect(() => {
    (async () => {
      setLoading(true);
      for (const file of acceptedFiles) {
        await mutateAsync({ file });
      }
      setLoading(false);
    })();
  }, [acceptedFiles]);

  return (
    <div className="col-span-full">
      {label && (
        <label htmlFor={`${name}-label2`} className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div
        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 relative"
        {...getRootProps()}
        // https://stackoverflow.com/questions/49671325/react-dropzone-opens-files-chooser-twice
      >
        <div className="text-center">
          <FontAwesomeIcon icon={faUpload} className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
            <label
              htmlFor={name}
              className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              // or upload prompt will be triggered twice
              onClick={(e) => e.stopPropagation()}
            >
              <span>{t('common.upload.file')}</span>
              <input id={name} className="sr-only" {...getInputProps()} />
            </label>
            <p className="pl-1">{t('common.upload.orDrop')}</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            {t('common.upload.restrictions', {
              types: mimeTypesToExtensions(allowedFileTypes ?? []).join(', '),
              size: bytesToHumanReadableFileSize(allowedFileSize),
            })}
          </p>
          <Transition
            show={loading}
            enter="transition-[backdrop-filter,opacity] duration-150"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-sm"
            leave="transition-[backdrop-filter,opacity] duration-150"
            leaveFrom="opacity-100 backdrop-blur-sm"
            leaveTo="opacity-0 backdrop-blur-none"
            className="absolute inset-0 flex justify-center items-center text-gray-600 backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faSpinner} spin size="2xl" />
          </Transition>
          <Transition
            show={isDragActive}
            enter="transition-[backdrop-filter,opacity] duration-150"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-sm"
            leave="transition-[backdrop-filter,opacity] duration-150"
            leaveFrom="opacity-100 backdrop-blur-sm"
            leaveTo="opacity-0 backdrop-blur-none"
            className="absolute inset-0 flex justify-center items-center text-gray-600 backdrop-blur-sm"
          >
            <FontAwesomeIcon icon={faPlus} size="2xl" />
          </Transition>
        </div>
      </div>
    </div>
  )
});

export default UploadDragger;
