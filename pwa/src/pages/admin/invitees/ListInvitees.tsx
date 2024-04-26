import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
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

type Inputs = {
  firstname: string;
  lastname: string;
  email: string | null;
  // TODO: willCome: boolean | null;
  // TODO: food: string | null; // Enum
  allergies: string | null;
  // TODO: tableId: TableModel['id'] | null;
  // TODO: cardId: Card['id'] | null;
};

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
      // TODO: food: z.nullable(z.string()),
      allergies: z.nullable(
        z
          .string()
          .max(255, { message: t('form.errors.max', { max: 255 }) }),
      ),
      // TODO: tableId
      // TODO: cardId
    });
  }, [t]);

  const updateInvitee = useUpdateInvitee(record.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: record.firstname,
      lastname: record.lastname,
      email: record.email,
      allergies: record.allergies,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    updateInvitee.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }, [updateInvitee, setOpen]);

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
          if (!updateInvitee.isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading: updateInvitee.isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(onSubmit)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: updateInvitee.isPending,
            onClick: () => {
              if (!updateInvitee.isPending) setOpen(false);
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {updateInvitee.isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{updateInvitee.error.response.data.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('firstname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.firstname')}
              placeholder={record.firstname}
              disabled={updateInvitee.isPending}
              required
            />
            {errors.firstname?.message && <span>{errors.firstname.message}</span>}
          </div>
          <div>
            <Input
              {...register('lastname', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.lastname')}
              placeholder={record.lastname}
              disabled={updateInvitee.isPending}
              required
            />
            {errors.lastname?.message && <span>{errors.lastname.message}</span>}
          </div>
          <div>
            <Input
              {...register('email', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.email')}
              placeholder={record.email || undefined}
              disabled={updateInvitee.isPending}
            />
            {errors.email?.message && <span>{errors.email.message}</span>}
          </div>
          <div>
            <Input
              {...register('allergies', { setValueAs: (value) => value === '' ? null : value })}
              label={t('invitee.allergies')}
              placeholder={record.allergies || undefined}
              disabled={updateInvitee.isPending}
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

function DeleteInvitee({ record }: { record: Invitee }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const deleteInvitee = useDeleteInvitee(record.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
      >
        {t('actions.delete')}
        <span className="sr-only">, {record.firstname} {record.lastname}</span>
      </button>
      <Modal
        type="warning"
        title={t('invitee.actions.delete.title')}
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!deleteInvitee.isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.delete'),
            layout: 'danger',
            loading: deleteInvitee.isPending,
            ref: saveButtonRef,
            onClick: () => {
              deleteInvitee.mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: deleteInvitee.isPending,
            onClick: () => {
              if (!deleteInvitee.isPending) setOpen(false);
            },
          },
        ]}
      >
        <p className="text-sm text-gray-500">
          {t('invitee.actions.delete.text', { firstname: record.firstname, lastname: record.lastname })}
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
            <DeleteInvitee record={record} />
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t]);

  if (invitees.data && tables.data && cards.data && food.data) {
    return (
      <Table rowKey="id" columns={columns} dataSource={invitees.data.records} />
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
