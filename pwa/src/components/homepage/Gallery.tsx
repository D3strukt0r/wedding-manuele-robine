import { useTranslation } from 'react-i18next';
import AlignedCard from '#/layout/AlignedCard';
import useGallery from '#/api/invited/gallery/useGallery.ts';
import BigSpinner from '#/layout/BigSpinner.tsx';
import ImageLazyLoad, { aspectRatio, ImageLazyLoadProps } from '#/components/common/ImageLazyLoad.tsx';
import blurHashMap from '#/img/blurhash-map.json';
import image from '#/img/Fotos.jpg';
import { GalleryImage as GalleryImageType } from '#/components/types.ts';
import { useCallback, useMemo, useState } from 'react';
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
          allowedFileSize={10 * 1024 * 1024} // 10MB
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

  const { mutate, isPending, isError, error } = useDownloadGalleryImages({
    onSuccess: ([blob, mimeType, filename]) => {
      downloadBlob(blob, mimeType, filename);
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(setError, error.response?.data?.violations)
    }
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          const fileIds = Object.entries(data.fileIds)
            .filter(([, selected]) => selected)
            .map(([id]) => +id);
          mutate({ fileIds });
        })}
      >
        <div className="flex justify-end gap-1 mb-2">
          <Button type="button" layout="app-primary" disabled={isPending} onClick={selectAll}>{t('homepage.gallery.selectAll')}</Button>
          <Button type="button" layout="app-primary" disabled={isPending} onClick={deselectAll}>{t('homepage.gallery.deselectAll')}</Button>
          <Button type="submit" layout="app-primary" loading={isPending}>{t('homepage.gallery.downloadSelected')}</Button>
          <Button type="button" layout="app-primary" loading={isPending} onClick={() => mutate({ fileIds: 'all' })}>{t('homepage.gallery.downloadAll')}</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="relative">
              <div className="absolute top-0 left-0 p-2 z-10 text-app-green bg-white/75 rounded-br-md">
                <Checkbox
                  {...register(`fileIds.${file.id}`)}
                  layout="app-primary"
                  disabled={isPending}
                  error={errors.fileIds?.[file.id]}
                  className="mx-1"
                />
              </div>
              <div
                title={t('homepage.gallery.downloadSingle')}
                className="absolute top-0 right-0 p-2 z-10 text-app-green bg-white/75 rounded-bl-md hover:bg-black hover:cursor-pointer"
                aria-disabled={isPending}
                onClick={() => !isPending && mutate({ fileIds: [file.id] })}
              >
                <FontAwesomeIcon icon={faDownload} size="2xl" />
              </div>
              <GalleryImage key={file.id} file={file} />
            </div>
          ))}
        </div>
      </form>
      {import.meta.env.DEV && (
        <DevTool control={control} />
      )}
    </>
  );
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
