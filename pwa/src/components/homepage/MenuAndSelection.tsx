import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DevTool } from '@hookform/devtools';
import menu from '/img/menu.png';
import AlignedCard from '#/layout/AlignedCard';
import Collapsible from '#/layout/Collapsible';
import { useAuthenticationContext } from '#/utils/authentication';
import { Invitee } from '#/components/types';
import Input from '#/components/common/Input';
import Checkbox from '#/components/common/Checkbox';
import RadioGroup from '#/components/common/RadioGroup';
import Button from '#/components/common/Button';
import QrScannerCheck, { CountdownHandle } from './QrScannerCheck';
import useLookupType, { EnumTypes } from '#/api/common/lookup/useLookupType';
import useInviteesOnCard from '#/api/invited/useInviteesOnCard';
import useUpdateInviteesOnCard from '#/api/invited/useUpdateInviteesOnCard';
import useLogin from '#/api/common/authentication/useLogin';
import BigSpinner from '#/layout/BigSpinner';
import { setErrorFromSymfonyViolations } from '#/utils/form';
import Alert from '#/components/common/Alert';

// https://stackoverflow.com/a/43467144/4156752
function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

interface Props {
  id?: string;
}
export default function ManuAndSelection({ id }: Props) {
  const { t } = useTranslation('app');
  const qrRef = useRef<CountdownHandle>(null);
  const [authentication, updateAuthentication] = useAuthenticationContext();

  const { mutate } = useLogin({
    onSuccess: (response) => {
      updateAuthentication(response.token);
    },
    onError: (e) => {
      qrRef.current?.showMessage(
        'error',
        t('homepage.qrScanner.loginFailed', { errorMessage: e.response?.data?.message }),
      );
    },
  });

  const handleScan = useCallback((result: QrScanner.ScanResult) => {
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
    mutate({ username, password });
  }, [qrRef, mutate, t]);

  return (
    <AlignedCard
      id={id}
      image={menu}
      topContent={
        <>
          <h2 className="uppercase text-3xl mb-6 philosopher-regular">
            {t('homepage.menu.title')}
          </h2>
          <div className="md:hidden">
            <Collapsible
              menuOptions={[
                {
                  key: 'meat',
                  title: t('homepage.menu.meat.title'),
                  text: t('homepage.menu.meat.text'),
                },
                {
                  key: 'vegetarian',
                  title: t('homepage.menu.vegetarian.title'),
                  text: t('homepage.menu.vegetarian.text'),
                },
              ]}
            />
          </div>
          <div className="hidden md:block">
            <h3 className="text-2xl mb-4 philosopher-regular">
              {t('homepage.menu.meat.title')}
            </h3>
            <p className="whitespace-pre-line noto-sans-regular">
              {t('homepage.menu.meat.text')}
            </p>
            <h3 className="text-2xl mb-4 philosopher-regular">
              {t('homepage.menu.vegetarian.title')}
            </h3>
            <p className="whitespace-pre-line noto-sans-regular">
              {t('homepage.menu.vegetarian.text')}
            </p>
          </div>
        </>
      }
      bottomContent={
        authentication ? (
          <InviteesListOnMyCardLoader />
        ) : (
          <QrScannerCheck ref={qrRef} onScan={handleScan} />
        )
      }
      align="left"
      backgroundColor="app-red-light"
      imageShadowColor="app-gray-dark"
    />
  );
}

function InviteesListOnMyCardLoader() {
  const invitees = useInviteesOnCard();

  const foodOptions = useLookupType(EnumTypes.FOOD);

  if (invitees.data && foodOptions.data) {
    return (
      <InviteesListOnMyCardForm
        invitees={invitees.data.records}
        foodOptions={foodOptions.data}
      />
    );
  }

  if (invitees.isError || foodOptions.isError) {
    return (
      <div>
        {invitees.isError && <p>{invitees.error.message}</p>}
        {foodOptions.isError && <p>{foodOptions.error.message}</p>}
      </div>
    );
  }

  return <BigSpinner />
}

function InviteesListOnMyCardForm({
  invitees,
  foodOptions,
}: {
  invitees: Omit<Invitee, 'cardId'>[];
  foodOptions: string[];
}) {
  const { t } = useTranslation('app');

  const schema = useMemo(() => {
    return z.object({
      invitees: z.record(
        z.string(),
        z.object({
          firstname: z
            .string({ required_error: t('form.errors.required') })
            .min(1, { message: t('form.errors.required') })
            .max(255, { message: t('form.errors.max', { max: 255 }) }),
          lastname: z
            .string({ required_error: t('form.errors.required') })
            .min(1, { message: t('form.errors.required') })
            .max(255, { message: t('form.errors.max', { max: 255 }) }),
          email: z.nullable(
            z.union([
              z
                .string()
                .max(255, { message: t('form.errors.max', { max: 255 }) })
                .email(t('form.errors.email')),
              z.string().length(0),
            ]),
          ),
          willCome: z.nullable(z.boolean()),
          food: z.nullable(z.string()),
          allergies: z.nullable(
            z
              .string()
              .max(255, { message: t('form.errors.max', { max: 255 }) }),
          ),
        }),
      ),
    });
  }, [t]);

  // map the id to the key of the object
  const mappedInvitees = useMemo(() => {
    const mappedObject: Record<Invitee['id'], Omit<Invitee, 'id' | 'cardId'>> = {};
    invitees.forEach((invitee) => {
      // omit the id as well
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = invitee;
      mappedObject[invitee.id] = rest;
    });
    return mappedObject;
  }, [invitees]);

  type Inputs = z.infer<typeof schema>;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      invitees: mappedInvitees,
    },
  });

  const { mutate, isPending, isError, error } = useUpdateInviteesOnCard({
    onSuccess: () => {
      reset();
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(setError, error.response?.data?.violations)
    }
  });

  return (
    <>
      {isError ? (
        <Alert
          type="error"
          title={t('form.errors.general')}
          text={<p>{error.response?.data?.title}</p>}
          className="mb-4"
        />
      ) : null}
      <form onSubmit={handleSubmit(mutate)} className="grid grid-cols-2 gap-4">
        {invitees.map((invitee) => (
          <div key={invitee.id}>
            <h3 className="text-xl philosopher-regular">
              {invitee.firstname} {invitee.lastname}
            </h3>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input
                  {...register(`invitees.${invitee.id}.firstname`, { setValueAs: (value) => value === '' ? null : value })}
                  label={t('homepage.manageCard.properties.firstname')}
                  layout="app-primary"
                  placeholder={invitee.firstname}
                  disabled={isPending}
                  error={errors.invitees?.[invitee.id]?.firstname}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  {...register(`invitees.${invitee.id}.lastname`, { setValueAs: (value) => value === '' ? null : value })}
                  label={t('homepage.manageCard.properties.lastname')}
                  layout="app-primary"
                  placeholder={invitee.lastname}
                  disabled={isPending}
                  error={errors.invitees?.[invitee.id]?.lastname}
                  required
                />
              </div>
            </div>
            <div>
              <Input
                {...register(`invitees.${invitee.id}.email`, { setValueAs: (value) => value === '' ? null : value })}
                label={t('homepage.manageCard.properties.email')}
                layout="app-primary"
                placeholder={invitee.email || undefined}
                disabled={isPending}
                error={errors.invitees?.[invitee.id]?.email}
              />
            </div>
            <div className="my-2">
              <Checkbox
                {...register(`invitees.${invitee.id}.willCome`)}
                label={t('homepage.manageCard.properties.willCome')}
                layout="app-primary"
                disabled={isPending}
                error={errors.invitees?.[invitee.id]?.willCome}
              />
            </div>
            <div>
              <RadioGroup
                label={t('homepage.manageCard.properties.food')}
                inline
                options={foodOptions.map((food) => ({
                  value: food,
                  title: t(`enum.food.${food}`),
                  ...register(`invitees.${invitee.id}.food`),
                }))}
                disabled={isPending}
                error={errors.invitees?.[invitee.id]?.food}
              />
            </div>
            <div>
              <Input
                {...register(`invitees.${invitee.id}.allergies`, { setValueAs: (value) => value === '' ? null : value })}
                label={t('homepage.manageCard.properties.allergies')}
                layout="app-primary"
                placeholder={invitee.allergies || undefined}
                disabled={isPending}
                error={errors.invitees?.[invitee.id]?.allergies}
              />
            </div>
          </div>
        ))}
        <Button
          type="submit"
          layout="app-primary"
          className="col-span-2"
          loading={isPending}
          disabled={!isDirty/* || !isValid*/}
        >
          {t('form.save')}
        </Button>
      </form>
      {import.meta.env.MODE === 'development' && (
        <DevTool control={control} />
      )}
    </>
  );
}
