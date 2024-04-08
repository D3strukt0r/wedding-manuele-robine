import {useTranslation} from "react-i18next";
import menu from '/menu.png';
import QrScannerCheck, {CountdownHandle} from "./QrScannerCheck.tsx";
import {useCallback, useContext, useMemo, useRef} from "react";
import AlignedCard from "../../layout/AlignedCard.tsx";
import Collapsible from "../../layout/Collapsible.tsx";
import AuthenticationContext from "../../context/AuthenticationContext.tsx";
import {api} from "../api.ts";
import QrScanner from "qr-scanner";
import {AxiosError} from "axios";
import {Invitee} from "../types.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from 'zod';
import Input from "../../form/Input.tsx";
import Checkbox from "../../form/Checkbox.tsx";
import {useQuery} from "@tanstack/react-query";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import RadioGroup from "../../form/RadioGroup.tsx";
import Button from "../../form/Button.tsx";
import {DevTool} from "@hookform/devtools";

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
  const {t} = useTranslation('app');

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
        <InviteesListOnMyCardLoader />
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

function InviteesListOnMyCardLoader() {
  const invitees = useQuery({
    queryKey: ['myInvitees'],
    queryFn: api.invited.invitees.list,
  });

  const foodOptions = useQuery({
    queryKey: ['enum', 'food'],
    queryFn: () => api.common.lookup.type('food'),
  });

  if (invitees.isPending || foodOptions.isPending) {
    return <FontAwesomeIcon icon={faSpinner} spin />;
  }

  if (invitees.isError || foodOptions.isError) {
    return (
      <div>
        {invitees.isError && <p>{invitees.error.message}</p>}
        {foodOptions.isError && <p>{foodOptions.error.message}</p>}
      </div>
    )
  }

  return <InviteesListOnMyCardForm invitees={invitees.data.records} foodOptions={foodOptions.data} />;
}

type Input = {
  firstname: string
  lastname: string
  email?: string
  willCome?: boolean
  food?: string
  allergies?: string
}
type Inputs = {
  [key: string]: Input
}

function InviteesListOnMyCardForm({invitees, foodOptions}: {invitees: Omit<Invitee, 'cardId'>[]; foodOptions: string[]}) {
  const {t} = useTranslation('app');

  const schema = useMemo(() => {
    return z.record(z.string(), z.object({
      firstname: z.string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') })
        .max(255, { message: t('form.errors.max', { max: 255 }) }),
      lastname: z.string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') })
        .max(255, { message: t('form.errors.max', { max: 255 }) }),
      email: z.nullable(z.union([
        z.string()
          .max(255, { message: t('form.errors.max', { max: 255 }) })
          .email(t('form.errors.email')),
        z.string().length(0)
      ])),
      willCome: z.nullable(z.boolean()),
      food: z.nullable(z.string()),
      allergies: z.nullable(z.string()
        .max(255, { message: t('form.errors.max', { max: 255 }) })
      ),
    }));
  }, [t]);

  // map the id to the key of the object
  const mappedInvitees = useMemo(() => {
    const mappedObject: Record<Invitee['id'], Omit<Invitee, 'id' | 'cardId'>> = {};
    invitees.forEach(invitee => {
      // omit the id as well
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {id, ...rest} = invitee;
      mappedObject[invitee.id] = rest;
    });
    return mappedObject;
  }, [invitees]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: mappedInvitees,
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    console.log(data);
  }, []);

  return (
    <>

      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {invitees.map((invitee) => (
          <div key={invitee.id}>
            <h3 className="text-xl philosopher-regular">{invitee.firstname} {invitee.lastname}</h3>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input
                  label={t('homepage.manageCard.properties.firstname')}
                  {...register(`${invitee.id}.firstname`)}
                  aria-invalid={errors[invitee.id]?.firstname ? "true" : "false"}
                />
                {errors[invitee.id]?.firstname?.message && <span>{errors[invitee.id]?.firstname?.message}</span>}
              </div>
              <div className="sm:col-span-3">
                <Input
                  label={t('homepage.manageCard.properties.lastname')}
                  {...register(`${invitee.id}.lastname`)}
                  aria-invalid={errors[invitee.id]?.lastname ? "true" : "false"}
                />
                {errors[invitee.id]?.lastname?.message && <span>{errors[invitee.id]?.lastname?.message}</span>}
              </div>
            </div>
            <div>
              <Input
                label={t('homepage.manageCard.properties.email')}
                {...register(`${invitee.id}.email`)}
                aria-invalid={errors[invitee.id]?.email ? "true" : "false"}
              />
              {errors[invitee.id]?.email?.message && <span>{errors[invitee.id]?.email?.message}</span>}
            </div>
            <div className="my-2">
              <Checkbox
                label={t('homepage.manageCard.properties.willCome')}
                {...register(`${invitee.id}.willCome`)}
                aria-invalid={errors[invitee.id]?.willCome ? "true" : "false"}
              />
              {errors[invitee.id]?.willCome?.message && <span>{errors[invitee.id]?.willCome?.message}</span>}
            </div>
            <div>
              <RadioGroup
                label={t('homepage.manageCard.properties.food')}
                inline
                options={foodOptions.map((food) => ({
                  value: food,
                  title: t(`enum.food.${food}`),
                  ...register(`${invitee.id}.food`),
                }))}
              />
              {errors[invitee.id]?.food?.message && <span>{errors[invitee.id]?.food?.message}</span>}
            </div>
            <div>
              <Input
                label={t('homepage.manageCard.properties.allergies')}
                {...register(`${invitee.id}.allergies`)}
                aria-invalid={errors[invitee.id]?.allergies ? "true" : "false"}
              />
              {errors[invitee.id]?.allergies?.message && <span>{errors[invitee.id]?.allergies?.message}</span>}
            </div>
          </div>
        ))}
        <Button type="submit" className="col-span-2">{t('form.save')}</Button>
      </form>
      {import.meta.env.MODE === 'development' && (
        <DevTool control={control} />
      )}
    </>
  );
}
