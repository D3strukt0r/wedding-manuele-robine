import { ReactNode, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Table, { TableProps } from '#/components/common/admin/Table';
import BigSpinner from '#/layout/BigSpinner';
import Modal from '#/components/common/admin/Modal';
import Alert from '#/components/common/admin/Alert';
import Input from '#/form/admin/Input';
import { Card, Invitee, Table as TableModel } from '#/components/types';
import useTables from '#/api/admin/table/useTables';
import useCards from '#/api/admin/cards/useCards';
import useInvitees from '#/api/admin/invitee/useInvitees';
import useDeleteInvitee from '#/api/admin/invitee/useDeleteInvitee';
import useUpdateInvitee from '#/api/admin/invitee/useUpdateInvitee';
import useLookupType, { EnumTypes } from '#/api/common/lookup/useLookupType';
import useCreateInvitee from '#/api/admin/invitee/useCreateInvitee.ts';
import Button from '#/form/admin/Button.tsx';

function CreateInvitee() {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

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
      // TODO: willCome: z.nullable(z.boolean()),
      // TODO: food: z.nullable(z.string()), // Enum
      allergies: z.nullable(
        z
          .string()
          .max(255, { message: t('form.errors.max', { max: 255 }) }),
      ),
      // TODO: tableId: TableModel['id'] | null;
      // TODO: cardId: Card['id'] | null;
    });
  }, [t]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: null,
      lastname: null,
      email: null,
      allergies: null,
    },
  });

  const { mutate, isPending, isError, error } = useCreateInvitee({
    onSuccess: () => {
      setOpen(false);
      reset();
    },
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
        setOpen={() => {
          if (!isPending) setOpen(false);
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
              if (!isPending) setOpen(false);
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response.data.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('firstname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.firstname')}
              disabled={isPending}
              required
            />
            {errors.firstname?.message && <span>{errors.firstname.message}</span>}
          </div>
          <div>
            <Input
              {...register('lastname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.lastname')}
              disabled={isPending}
              required
            />
            {errors.lastname?.message && <span>{errors.lastname.message}</span>}
          </div>
          <div>
            <Input
              {...register('email', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.email')}
              disabled={isPending}
            />
            {errors.email?.message && <span>{errors.email.message}</span>}
          </div>
          <div>
            <Input
              {...register('allergies', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.allergies')}
              disabled={isPending}
            />
            {errors.allergies?.message && <span>{errors.allergies.message}</span>}
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
      // TODO: willCome: z.nullable(z.boolean()),
      // TODO: food: z.nullable(z.string()), // Enum
      allergies: z.nullable(
        z
          .string()
          .max(255, { message: t('form.errors.max', { max: 255 }) }),
      ),
      // TODO: tableId: TableModel['id'] | null;
      // TODO: cardId: Card['id'] | null;
    });
  }, [t]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: record.firstname,
      lastname: record.lastname,
      email: record.email,
      allergies: record.allergies,
    },
  });

  const { mutate, isPending, isError, error } = useUpdateInvitee(record.id, {
    onSuccess: () => {
      setOpen(false);
      reset();
    },
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
        setOpen={() => {
          if (!isPending) setOpen(false);
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
              if (!isPending) setOpen(false);
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response.data.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('firstname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.firstname')}
              placeholder={record.firstname}
              disabled={isPending}
              required
            />
            {errors.firstname?.message && <span>{errors.firstname.message}</span>}
          </div>
          <div>
            <Input
              {...register('lastname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.lastname')}
              placeholder={record.lastname}
              disabled={isPending}
              required
            />
            {errors.lastname?.message && <span>{errors.lastname.message}</span>}
          </div>
          <div>
            <Input
              {...register('email', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.email')}
              placeholder={record.email || undefined}
              disabled={isPending}
            />
            {errors.email?.message && <span>{errors.email.message}</span>}
          </div>
          <div>
            <Input
              {...register('allergies', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.allergies')}
              placeholder={record.allergies || undefined}
              disabled={isPending}
            />
            {errors.allergies?.message && <span>{errors.allergies.message}</span>}
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
        setOpen={() => {
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
    },
    {
      key: 'cardId',
      title: t('invitee.card'),
    },
    {
      key: 'actions',
      title: <span className="sr-only">{t('table.actions')}</span>,
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
  ] satisfies TableProps['columns'], [t]);

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
