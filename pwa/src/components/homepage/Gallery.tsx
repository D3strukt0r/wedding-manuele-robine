import { useTranslation } from 'react-i18next';
import AlignedCard from '#/layout/AlignedCard';
import useGallery from '#/api/invited/gallery/useGallery.ts';
import BigSpinner from '#/layout/BigSpinner.tsx';
import ImageLazyLoad, { aspectRatio } from '#/components/common/ImageLazyLoad.tsx';
import blurHashMap from '#/img/blurhash-map.json';
import image from '#/img/Fotos.jpg';
import { GalleryImage as GalleryImageType } from '#/components/types.ts';
import { useMemo } from 'react';
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
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
      bottomContent={<CompleteGallery />}
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
                    <div className="flex space-x-2 py-1">
                      <div className="h-6 w-6 overflow-hidden">
                        <GalleryImage file={alreadyUploaded} />
                      </div>
                      <p>{alreadyUploaded.fileName}</p>
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
                  <p className="py-1">{t('homepage.gallery.toBeUploaded')}</p>
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
          disabled={!isDirty || !isValid}
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

function CompleteGallery() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryFileIds.data.files.map((file) => (
          <GalleryImage key={file.id} file={file} />
        ))}
      </div>
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

interface GalleryImageProps {
  file: GalleryImageType;
}

function GalleryImage({ file }: GalleryImageProps) {
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
      className="w-full"
      wrapperStyle={{ aspectRatio: `${width}/${height}` }}
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
