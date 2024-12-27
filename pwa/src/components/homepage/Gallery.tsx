import { useTranslation } from 'react-i18next';
import AlignedCard from '#/layout/AlignedCard';
import useGallery from '#/api/invited/gallery/useGallery.ts';
import BigSpinner from '#/layout/BigSpinner.tsx';
import ImageLazyLoad, { aspectRatio, ImageLazyLoadProps } from '#/components/common/ImageLazyLoad.tsx';
import blurHashMap from '#/img/blurhash-map.json';
import image from '#/img/Fotos.jpg';
import LogoPolarsteps from '#/assets/logo-polarsteps.svg?react';
import { GalleryImage as GalleryImageType } from '#/components/types.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthenticationContext } from '#/utils/authentication.tsx';
import useMyGallery from '#/api/invited/gallery/useMyGallery.ts';
import * as z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setErrorFromSymfonyViolations } from '#/utils/form.ts';
import useUpdateMyGallery from '#/api/invited/gallery/useUpdateMyGallery.ts';
import { DevTool } from '@hookform/devtools';
import UploadDragger from '#/components/common/UploadDragger.tsx';
import Button from '#/components/common/Button.tsx';
import ListCard from '#/components/common/ListCard.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Checkbox from '#/components/common/Checkbox.tsx';
import useDownloadGalleryImages from '#/api/invited/gallery/useDownloadGalleryImages.ts';
import { downloadBlob } from '#/utils/download.ts';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { AxiosProgressEvent } from 'axios';
import useDownloadState, { DownloadCheckAsyncProcess } from '#/api/invited/gallery/useDownloadState.ts';

interface Props {
  id?: string;
  isLast?: boolean;
}
export default function Gallery({ id, isLast }: Props) {
  const { t } = useTranslation('app');
  const [authentication] = useAuthenticationContext();

  return (
    <AlignedCard
      id={id}
      isLast={isLast}
      image={
        <ImageLazyLoad
          src={image}
          alt="Fotos"
          blurhash={blurHashMap.fotosJpg}
          imgSources={(
            <>
              {/*<source srcSet={imageWebp} type="image/webp" />*/}
              <source srcSet={image} type="image/jpeg" />
            </>
          )}
        />}
      topContent={
        <>
          <h2 className="uppercase text-title mb-6 font-philosopher">
            {t('homepage.gallery.title')}
          </h2>
          <p className="whitespace-pre-line text-normal font-noto-sans md:max-w-prose">
            {t('homepage.gallery.text')}
          </p>
          <div className="flex flex-wrap items-start gap-2 mt-4">
            <a href="https://www.instagram.com/travel.za.world/" target="_blank"
               className="rounded-md bg-[#c13584] px-3.5 py-2.5 text-sm font-semibold !text-white !no-underline !not-italic shadow-sm hover:bg-[#c13584]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c13584]/50">
              <FontAwesomeIcon icon={faInstagram} /> Instagram (@travel.za.world)
            </a>
          </div>
          <div className="flex flex-wrap items-start gap-2 mt-4">
            <a href="https://www.polarsteps.com/RubySu" className="rounded-md bg-[#cc3e55] px-3.5 py-2.5 text-sm font-semibold !text-white !no-underline !not-italic shadow-sm hover:bg-[#cc3e55]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cc3e55]/50">
              <LogoPolarsteps className="inline-block h-[1em] box-content align-[-0.125em]" /> Polarsteps (Robine)
            </a>
            <a href="https://www.polarsteps.com/D3strukt0r" className="rounded-md bg-[#cc3e55] px-3.5 py-2.5 text-sm font-semibold !text-white !no-underline !not-italic shadow-sm hover:bg-[#cc3e55]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cc3e55]/50">
              <LogoPolarsteps className="inline-block h-[1em] box-content align-[-0.125em]" /> Polarsteps (Manuele)
            </a>
          </div>
          {authentication ? (
            <div className="mt-8">
              <MyGalleryUploadLoader />
            </div>
          ) : (
            <p className="text-normal font-noto-sans mt-8">
              {t('homepage.gallery.pleaseLogin')}
            </p>
          )}
        </>
      }
      bottomContent={<GalleryLoader />}
      align="right"
      backgroundColor="app-yellow-dark"
      imageShadowColor="app-green-dark"
    />
  );
}

function MyGalleryUploadLoader() {
  const myGallery = useMyGallery();

  if (myGallery.data) {
    return (
      <MyGalleryUploadForm
        files={myGallery.data.files}
      />
    );
  }

  if (myGallery.isError) {
    return (
      <div>
        {myGallery.isError && <p>{myGallery.error.message}</p>}
      </div>
    );
  }

  return <BigSpinner />;
}

interface MyGalleryUploadFormProps {
  files: GalleryImageType[];
}
function MyGalleryUploadForm({ files }: MyGalleryUploadFormProps) {
  const { t } = useTranslation('app');
  const [uploading, setUploading] = useState(false);

  const schema = useMemo(() => {
    return z.object({
      fileIds: z.array(z.number()),
    });
  }, [t]);

  type Inputs = z.infer<typeof schema>;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => ({
      fileIds: files.map((file) => file.id),
    }), []),
  });

  const { mutate, isPending, isError, error } = useUpdateMyGallery({
    onSuccess: (data) => {
      reset({
        fileIds: data.files.map((file) => file.id),
      });
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(setError, error.response?.data?.violations)
    }
  });

  const fileIds = useWatch({ control, name: 'fileIds' })

  return (
    <>
      <form onSubmit={handleSubmit(mutate)}>
        <UploadDragger
          name="fileIds"
          control={control}
          label={t('homepage.gallery.upload')}
          disabled={isPending}
          allowedFileTypes={['image/jpeg', 'image/png']}
          allowedFileSize={20 * 1024 * 1024} // 20MB
          onLoading={setUploading}
        />
        <ListCard
          customHeight
          items={fileIds.map((fileId) => {
            const alreadyUploaded = files.find((file) => file.id === fileId);
            if (alreadyUploaded) {
              return {
                id: fileId,
                content: (
                  <div className="flex justify-between">
                    <div className="flex space-x-2 py-1 pr-1 w-full overflow-hidden">
                      <GalleryImage
                        file={alreadyUploaded}
                        wrapperClassName="min-w-6 max-w-6"
                        className="h-6 object-cover"
                        wrapperStyle={{aspectRatio: 'auto'}}
                      />
                      <p className="text-ellipsis overflow-hidden">{alreadyUploaded.fileName}</p>
                    </div>
                    <button onClick={() => {
                      setValue('fileIds', fileIds.filter((id) => id !== fileId), { shouldDirty: true });
                    }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ),
              };
            }
            return {
              id: fileId,
              content: (
                <div className="flex justify-between">
                  <p className="py-1 pr-1">{t('homepage.gallery.toBeUploaded')}</p>
                  <button
                    onClick={() => {
                      setValue('fileIds', fileIds.filter((id) => id !== fileId), { shouldDirty: true });
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )
            };
          })}
        />
        <Button
          type="submit"
          layout="app-primary"
          className="w-full mt-4"
          loading={isPending}
          disabled={!isDirty || !isValid || uploading}
        >
          {t('form.save')}
        </Button>
      </form>
      {import.meta.env.DEV && (
        <DevTool control={control} />
      )}
    </>
  );
}

function GalleryLoader() {
  const { t } = useTranslation('app');

  const galleryFileIds = useGallery();

  if (galleryFileIds.data) {
    if (galleryFileIds.data.files.length === 0) {
      return (
        <p className="text-normal font-noto-sans">
          {t('homepage.gallery.noImages')}
        </p>
      );
    }
    return (
      <GalleryAndDownload files={galleryFileIds.data.files} />
    );
  }

  if (galleryFileIds.error) {
    return (
      <p className="text-normal font-noto-sans">
        {t('homepage.gallery.error')}
      </p>
    );
  }

  return (
    <BigSpinner />
  );
}

interface GalleryAndDownloadProps {
  files: GalleryImageType[];
}

function GalleryAndDownload({ files }: GalleryAndDownloadProps) {
  const {t} = useTranslation('app');

  const schema = useMemo(() => {
    return z.object({
      fileIds: z.record(z.string(), z.boolean()),
    })
  }, []);

  type Inputs = z.infer<typeof schema>;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => ({
      fileIds: Object.fromEntries(files.map((file) => [file.id, false])),
    }), []),
  });

  const selectAll = useCallback(() => {
    for (const file of files) {
      setValue(`fileIds.${file.id}`, true, { shouldDirty: true });
    }
  }, [files, setValue]);

  const deselectAll = useCallback(() => {
    for (const file of files) {
      setValue(`fileIds.${file.id}`, false, { shouldDirty: true });
    }
  }, [files, setValue]);

  const [progress, setProgress] = useState<AxiosProgressEvent>();
  const [isPendingAsync, setIsPendingAsync] = useState(false);
  const [asyncDownloadHash, setAsyncDownloadHash] = useState<string>();
  const [lastRequestedFileIds, setLastRequestedFileIds] = useState<number[] | 'all'>();

  const { mutate, isPending, isError, error } = useDownloadGalleryImages({
    onSuccess: (response) => {
      // check if is object with property hash
      if (typeof response === 'object' && 'hash' in response) {
        setAsyncDownloadHash(response.hash);
        setIsPendingAsync(true);
        return;
      }

      const [blob, mimeType, filename] = response;
      downloadBlob(blob, mimeType, filename);
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(setError, error.response?.data?.violations)
    }
  }, {
    onDownloadProgress: (progressEvent) => {
      setProgress(progressEvent);

      if (progressEvent.progress === 1) {
        setTimeout(() => {
          setProgress(undefined);
        }, 1000);
      }
    },
  });

  const onFinishAsyncDownload = useCallback(() => {
    setTimeout(() => {
      setIsPendingAsync(false);
      setAsyncDownloadHash(undefined);
      mutate({ fileIds: lastRequestedFileIds });
      setLastRequestedFileIds(undefined);
    }, 1000);
  }, [setIsPendingAsync, setAsyncDownloadHash, mutate, lastRequestedFileIds, setLastRequestedFileIds]);

  const bytesToHumanReadableFileSize = useCallback((bytes: number, decimalPlaces = 2, sizes = ['B', 'KB', 'MB', 'GB']) => {
    if (bytes === 0) {
      return '0 B';
    }

    const baseLog = 1024;
    const magnitude = Math.min(Math.floor(Math.log(bytes) / Math.log(baseLog)), sizes.length - 1);

    return `${Number.parseFloat((bytes / (baseLog ** magnitude)).toString()).toFixed(decimalPlaces)} ${sizes[magnitude]}`;
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          const fileIds = Object.entries(data.fileIds)
            .filter(([, selected]) => selected)
            .map(([id]) => +id);
          setLastRequestedFileIds(fileIds);
          mutate({ fileIds });
        })}
      >
        <div className="flex flex-wrap justify-end gap-1 mb-2">
          <Button type="button" layout="app-primary" disabled={isPending || isPendingAsync} onClick={selectAll}>{t('homepage.gallery.selectAll')}</Button>
          <Button type="button" layout="app-primary" disabled={isPending || isPendingAsync} onClick={deselectAll}>{t('homepage.gallery.deselectAll')}</Button>
          <Button type="submit" layout="app-primary" loading={isPending || isPendingAsync}>{t('homepage.gallery.downloadSelected')}</Button>
          <Button type="button" layout="app-primary" loading={isPending || isPendingAsync} onClick={() => {
            setLastRequestedFileIds('all');
            mutate({ fileIds: 'all' });
          }}>{t('homepage.gallery.downloadAll')}</Button>
        </div>
        {isPendingAsync && asyncDownloadHash && (
          <div className="mb-2">
            <AsyncDownload hash={asyncDownloadHash} onFinish={onFinishAsyncDownload} />
          </div>
        )}
        {progress && progress.lengthComputable && (
          <div className="mb-2">
            {typeof progress.progress === 'number' && (
              <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="bg-app-green text-xs font-medium text-gray-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress.progress * 100}%` }}> {Math.ceil(progress.progress * 100 * 100) / 100}%</div>
              </div>
            )}
            <p>
              {[
                `${bytesToHumanReadableFileSize(progress.loaded)}${progress.total !== undefined ? ` / ${bytesToHumanReadableFileSize(progress.total)}` : ''}`,
                progress.estimated !== undefined ? `${Math.ceil( progress.estimated)} sekunden` : undefined,
                progress.rate !== undefined ? `${bytesToHumanReadableFileSize(progress.rate)}/s` : undefined,
              ].filter(Boolean).join(' | ')}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="relative">
              <div className="absolute top-0 left-0 p-2 z-10 text-app-green bg-white/75 rounded-br-md">
                <Checkbox
                  {...register(`fileIds.${file.id}`)}
                  layout="app-primary"
                  disabled={isPending || isPendingAsync}
                  error={errors.fileIds?.[file.id]}
                  className="mx-1"
                />
              </div>
              <div
                title={t('homepage.gallery.downloadSingle')}
                className="absolute top-0 right-0 p-2 z-10 text-app-green bg-white/75 rounded-bl-md hover:bg-white/25 hover:text-app-green-dark/50 hover:cursor-pointer"
                aria-disabled={isPending || isPendingAsync}
                onClick={() => !isPending && !isPendingAsync && mutate({ fileIds: [file.id] })}
              >
                <FontAwesomeIcon icon={faDownload} size="2xl" />
              </div>
              <GalleryImage key={file.id} file={file} />
            </div>
          ))}
        </div>
      </form>
      {import.meta.env.DEV && (
        <DevTool control={control} styles={{button: {top: `${(2 * 5) + 14}px`}}} />
      )}
    </>
  );
}

function AsyncDownload({ hash, onFinish }: { hash: string; onFinish: () => void }) {
  const { t } = useTranslation('app');

  const downloadState = useDownloadState(hash, {
    gcTime: 0, // clear cache of "previous" download state on unmount, ready for next download
    refetchIntervalInBackground: true, // needs to keep updating the download state, so we can move forward to actual download
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (downloadState.data && !['pending', 'create_zip', 'downloading', 'caching'].includes(downloadState.data.state)) {
      onFinish?.();
    }
  }, [downloadState.data?.state]);

  if (downloadState.data) {
    const getMessageForState = (data: DownloadCheckAsyncProcess) => {
      switch (data.state) {
        case 'pending':
          return t('homepage.gallery.downloadAsyncPending');
        case 'create_zip':
          return t('homepage.gallery.downloadAsyncCreateZip');
        case 'downloading':
          return t('homepage.gallery.downloadAsyncDownloading', {current: data.context.countDone, total: data.fileCount})
        case 'caching':
          return t('homepage.gallery.downloadAsyncCaching');
        default:
          return t('homepage.gallery.downloadAsyncReady');
      }
    };

    const calculateProgress = (data: DownloadCheckAsyncProcess) => {
      // pending = 0%, create_zip = 5%, downloading = 5% - 90%, caching = 95%
      switch (data.state) {
        case 'pending':
          return 0;
        case 'create_zip':
          return 0.05;
        case 'downloading':
          const imageProgressDone = data.context.countDone / data.fileCount;
          return 0.05 + Math.round(imageProgressDone * (90 - 5)) / 100;
        case 'caching':
          return 0.95;
        default:
          return 1;
      }
    }
    const progress = calculateProgress(downloadState.data);

    return (
      <>
        <p>{getMessageForState(downloadState.data)}</p>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div className="bg-app-green text-xs font-medium text-gray-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress * 100}%` }}> {Math.ceil(progress * 100 * 100) / 100}%</div>
        </div>
      </>
    );
  }

  if (downloadState.isError) {
    throw new Error(downloadState.error.message);
  }

  return <BigSpinner />;
}

interface GalleryImageProps {
  file: GalleryImageType;
  className?: ImageLazyLoadProps['className'];
  wrapperClassName?: ImageLazyLoadProps['wrapperClassName'];
  wrapperStyle?: ImageLazyLoadProps['wrapperStyle'];
}

function GalleryImage({ file, className, wrapperClassName, wrapperStyle }: GalleryImageProps) {
  const isOptimized = useMemo(() => {
    return file.children.length > 0;
  }, [file.children.length]);

  // extract the main image possibly a jpg mimetype from the optimized images
  const mainImage = useMemo(() => {
    return isOptimized
      ? (file.children.find((child) => child.mimeType === 'image/jpeg') ?? file)
      : file;
  }, [file.children, isOptimized]);
  // ... and the webp image as the first source
  const imageWebp = useMemo(() => {
    return isOptimized
      ? (file.children.find((child) => child.mimeType === 'image/webp') ?? null)
      : null;
  }, [file.children, isOptimized]);
  // ... extract those two and use them as the other sources
  const otherSources = useMemo(() => {
    return isOptimized
      ? file.children.filter((child) => ![mainImage.id, imageWebp?.id].filter(Boolean).includes(child.id))
      : [];
  }, [file.children, isOptimized, mainImage, imageWebp]);

  const [width, height] = useMemo(() => {
    return aspectRatio(mainImage.width, mainImage.height);
  }, [mainImage.width, mainImage.height]);

  return (
    <ImageLazyLoad
      // TODO: eventually use `file.publicUrl`
      src={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${mainImage.id}`}
      width={mainImage.width}
      height={mainImage.height}
      customSizeHandling
      className={clsx('w-full', className)}
      wrapperClassName={wrapperClassName}
      wrapperStyle={{ aspectRatio: `${width}/${height}`, ...wrapperStyle }}
      blurhash={mainImage.blurhash}
      imgSources={(
        <>
          {imageWebp && (
            <source srcSet={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${imageWebp.id}`} type="image/webp" />
          )}
          {otherSources.map((source) => (
            <source key={source.id} srcSet={`${document.documentElement.dataset.apiUrl}/invited/api/gallery/${source.id}`} type={source.mimeType} />
          ))}
        </>
      )}
    />
  )
}
