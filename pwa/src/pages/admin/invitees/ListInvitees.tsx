import { ReactNode, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Table, { TableProps } from '#/components/common/Table';
import BigSpinner from '#/layout/BigSpinner';
import Modal from '#/components/common/Modal';
import Alert from '#/components/common/Alert';
import Input from '#/components/common/Input';
import { Invitee } from '#/components/types';
import useTables from '#/api/admin/table/useTables';
import useCards from '#/api/admin/cards/useCards';
import useInvitees from '#/api/admin/invitee/useInvitees';
import useDeleteInvitee from '#/api/admin/invitee/useDeleteInvitee';
import useUpdateInvitee from '#/api/admin/invitee/useUpdateInvitee';
import useLookupType, { EnumTypes } from '#/api/common/lookup/useLookupType';
import useCreateInvitee from '#/api/admin/invitee/useCreateInvitee';
import Button from '#/components/common/Button';
import { setErrorFromSymfonyViolations } from '#/utils/form';
import Select from '#/components/common/Select';
import Checkbox from '#/components/common/Checkbox';

function CreateInvitee() {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const food = useLookupType(EnumTypes.FOOD);
  const tables = useTables();
  const cards = useCards();

  const schema = useMemo(() => {
    return z.object({
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
      food: z.nullable(z.enum(food.data ?? [])),
      allergies: z.nullable(
        z
          .string()
          .max(255, { message: t('form.errors.max', { max: 255 }) }),
      ),
      tableId: z.nullable(z.number()),
      cardId: z.nullable(z.number()),
    });
  }, [t]);

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
      firstname: null,
      lastname: null,
      email: null,
      willCome: null,
      food: null,
      allergies: null,
      tableId: null,
      cardId: null,
    },
  });

  const { mutate, isPending, isError, error } = useCreateInvitee({
    onSuccess: () => {
      setOpen(false);
      reset();
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(setError, error.response?.data?.violations)
    }
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        {t('invitee.actions.create.title')}
      </Button>
      <Modal
        title={t('invitee.actions.create.title')}
        initialFocus={saveButtonRef}
        open={open}
        onClose={() => {
          if (!isPending) {
            setOpen(false);
            reset();
          }
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading: isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(mutate)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: isPending,
            onClick: () => {
              if (!isPending) {
                setOpen(false);
                reset();
              }
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response?.data?.title}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('firstname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.firstname')}
              disabled={isPending}
              error={errors.firstname}
              required
            />
          </div>
          <div>
            <Input
              {...register('lastname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.lastname')}
              disabled={isPending}
              error={errors.lastname}
              required
            />
          </div>
          <div>
            <Input
              {...register('email', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.email')}
              disabled={isPending}
              error={errors.email}
            />
          </div>
          <div>
            <Checkbox
              {...register('willCome')}
              label={t('invitee.willCome')}
              disabled={isPending}
              error={errors.willCome}
            />
          </div>
          <div>
            <Select<Inputs>
              name="food"
              control={control}
              options={food.data?.map((item) => ({ label: t(`enum.food.${item}`), value: item })) ?? []}
              nullable
              label={t('invitee.food')}
              disabled={isPending}
              error={errors.food}
            />
          </div>
          <div>
            <Input
              {...register('allergies', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.allergies')}
              disabled={isPending}
              error={errors.allergies}
            />
          </div>
          <div>
            <Select<Inputs>
              name="tableId"
              control={control}
              options={tables.data?.records?.map((table) => ({ label: table.name, value: table.id })) ?? []}
              nullable
              label={t('invitee.table')}
              disabled={isPending}
              error={errors.food}
            />
          </div>
          <div>
            <Select<Inputs>
              name="cardId"
              control={control}
              options={cards.data?.records?.map((card) => ({ label: `X (ID: ${card.id})`, value: card.id })) ?? []}
              nullable
              label={t('invitee.card')}
              disabled={isPending}
              error={errors.food}
            />
          </div>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function UpdateInvitee({ record }: { record: Invitee }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const food = useLookupType(EnumTypes.FOOD);
  const tables = useTables();
  const cards = useCards();

  const schema = useMemo(() => {
    return z.object({
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
      food: z.nullable(z.enum(food.data ?? [])),
      allergies: z.nullable(
        z
          .string()
          .max(255, { message: t('form.errors.max', { max: 255 }) }),
      ),
      tableId: z.nullable(z.number()),
      cardId: z.nullable(z.number()),
    });
  }, [t]);

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
      firstname: record.firstname,
      lastname: record.lastname,
      email: record.email,
      willCome: record.willCome,
      food: record.food,
      allergies: record.allergies,
      tableId: record.tableId,
      cardId: record.cardId,
    },
  });

  const { mutate, isPending, isError, error } = useUpdateInvitee(record.id, {
    onSuccess: () => {
      setOpen(false);
      reset();
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(setError, error.response?.data?.violations)
    }
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-900"
      >
        {t('actions.update')}
        <span className="sr-only">, {record.id}</span>
      </button>
      <Modal
        title={t('invitee.actions.update.title')}
        initialFocus={saveButtonRef}
        open={open}
        onClose={() => {
          if (!isPending) {
            setOpen(false);
            reset();
          }
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading: isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(mutate)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: isPending,
            onClick: () => {
              if (!isPending) {
                setOpen(false);
                reset();
              }
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response?.data?.title}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('firstname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.firstname')}
              placeholder={record.firstname}
              disabled={isPending}
              error={errors.firstname}
              required
            />
          </div>
          <div>
            <Input
              {...register('lastname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.lastname')}
              placeholder={record.lastname}
              disabled={isPending}
              error={errors.lastname}
              required
            />
          </div>
          <div>
            <Input
              {...register('email', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.email')}
              placeholder={record.email || undefined}
              disabled={isPending}
              error={errors.email}
            />
          </div>
          <div>
            <Checkbox
              {...register('willCome')}
              label={t('invitee.willCome')}
              disabled={isPending}
              error={errors.willCome}
            />
          </div>
          <div>
            <Select<Inputs>
              name="food"
              control={control}
              options={food.data?.map((item) => ({label: t(`enum.food.${item}`), value: item})) ?? []}
              nullable
              label={t('invitee.food')}
              disabled={isPending}
              error={errors.food}
            />
          </div>
          <div>
            <Input
              {...register('allergies', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.allergies')}
              placeholder={record.allergies || undefined}
              disabled={isPending}
              error={errors.allergies}
            />
          </div>
          <div>
            <Select<Inputs>
              name="tableId"
              control={control}
              options={tables.data?.records?.map((table) => ({ label: table.name, value: table.id })) ?? []}
              nullable
              label={t('invitee.table')}
              disabled={isPending}
              error={errors.food}
            />
          </div>
          <div>
            <Select<Inputs>
              name="cardId"
              control={control}
              options={cards.data?.records?.map((card) => ({label: `X (ID: ${card.id})`, value: card.id})) ?? []}
              nullable
              label={t('invitee.card')}
              disabled={isPending}
              error={errors.food}
            />
          </div>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function DeleteInvitee({ id, name }: { id: Invitee['id'], name: ReactNode }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const { mutate, isPending } = useDeleteInvitee(id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
      >
        {t('actions.delete')}
        <span className="sr-only">, {name}</span>
      </button>
      <Modal
        type="warning"
        title={t('invitee.actions.delete.title')}
        initialFocus={saveButtonRef}
        open={open}
        onClose={() => {
          if (!isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.delete'),
            layout: 'danger',
            loading: isPending,
            ref: saveButtonRef,
            onClick: () => {
              mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: isPending,
            onClick: () => {
              if (!isPending) setOpen(false);
            },
          },
        ]}
      >
        <p className="text-sm text-gray-500">
          {t('invitee.actions.delete.text', { name })}
        </p>
      </Modal>
    </>
  );
}

export default function ListInvitees() {
  const { t } = useTranslation('app');

  const invitees = useInvitees();
  const tables = useTables();
  const cards = useCards();
  const food = useLookupType(EnumTypes.FOOD);

  const columns = useMemo(() => [
    {
      key: 'firstname',
      title: t('invitee.firstname'),
    },
    {
      key: 'lastname',
      title: t('invitee.lastname'),
    },
    {
      key: 'tableId',
      title: t('invitee.table'),
      render: (tableId) => tables.data?.records?.find((table) => table.id === tableId)?.name,
    },
    {
      key: 'cardId',
      title: t('invitee.card'),
    },
    {
      key: 'actions',
      title: <span className="sr-only">{t('invitee.actions')}</span>,
      render: (actions, record) => (
        <div className="flex space-x-4">
          {actions?.update && (
            <UpdateInvitee record={record} />
          )}
          {actions?.delete && (
            <DeleteInvitee id={record.id} name={`${record.firstname} ${record.lastname}`} />
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t, tables.data?.records]);

  if (invitees.data && tables.data && cards.data && food.data) {
    return (
      <>
        <div className="flex justify-end mb-2">
          <CreateInvitee />
        </div>
        <Table rowKey="id" columns={columns} dataSource={invitees.data.records} />
      </>
    );
  }

  if (invitees.isError || tables.isError || cards.isError || food.isError) {
    const error: string[] = [];
    if (invitees.error) error.push(invitees.error.message);
    if (tables.error) error.push(tables.error.message);
    if (cards.error) error.push(cards.error.message);
    if (food.error) error.push(food.error.message);
    throw new Error(error.join('\n'));
  }

  return <BigSpinner />;
}
