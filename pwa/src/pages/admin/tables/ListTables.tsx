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
import Button from '#/components/common/Button';
import { Table as TableModel } from '#/components/types';
import useUsers from '#/api/admin/user/useUsers';
import useTables from '#/api/admin/table/useTables';
import useDeleteTable from '#/api/admin/table/useDeleteTable';
import useUpdateTable from '#/api/admin/table/useUpdateTable';
import useCreateTable from '#/api/admin/table/useCreateTable';
import { setErrorFromSymfonyViolations } from '#/utils/form';
import useInvitees from '#/api/admin/invitee/useInvitees';
import Select from '#/components/common/Select';

function CreateTable() {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const invitees = useInvitees();

  const schema = useMemo(() => {
    return z.object({
      name: z
        .string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') }),
      seats: z
        .number({ required_error: t('form.errors.required') })
        .min(0, { message: t('form.errors.required') }),
      inviteeIds: z.array(z.number()),
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
      name: null,
      seats: null,
      inviteeIds: [],
    },
  });

  const { mutate, isPending, isError, error } = useCreateTable({
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
        {t('table.actions.create.title')}
      </Button>
      <Modal
        title={t('table.actions.create.title')}
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
            text: t('actions.create'),
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
              {...register('name', { setValueAs: (value) => value === '' ? null : value })}
              label={t('table.name')}
              disabled={isPending}
              error={errors.name}
              required
            />
          </div>
          <div>
            <Input
              {...register('seats', { valueAsNumber: true })}
              type="number"
              label={t('table.seats')}
              disabled={isPending}
              error={errors.seats}
              required
            />
          </div>
          <div>
            <Select<Inputs>
              name="inviteeIds"
              control={control}
              options={invitees.data?.records?.map((invitee) => ({ label: `${invitee.firstname} ${invitee.lastname}`, value: invitee.id })) ?? []}
              multiple
              label={t('table.invitees')}
              disabled={isPending}
              error={errors.inviteeIds}
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

function UpdateTable({ record }: { record: TableModel }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const invitees = useInvitees();

  const schema = useMemo(() => {
    return z.object({
      name: z
        .string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') }),
      seats: z
        .number({ required_error: t('form.errors.required') })
        .min(0, { message: t('form.errors.required') }),
      inviteeIds: z.array(z.number()),
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
      name: record.name,
      seats: record.seats,
      inviteeIds: record.inviteeIds,
    },
  });

  const { mutate, isPending, isError, error } = useUpdateTable(record.id, {
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
        title={t('table.actions.update.title')}
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
              {...register('name', { setValueAs: (value) => value === '' ? null : value })}
              label={t('table.name')}
              placeholder={record.name}
              disabled={isPending}
              error={errors.name}
              required
            />
          </div>
          <div>
            <Input
              {...register('seats', { valueAsNumber: true })}
              type="number"
              label={t('table.seats')}
              placeholder={`${record.seats}`}
              disabled={isPending}
              error={errors.seats}
              required
            />
          </div>
          <div>
            <Select<Inputs>
              name="inviteeIds"
              control={control}
              options={invitees.data?.records?.map((invitee) => ({ label: `${invitee.firstname} ${invitee.lastname}`, value: invitee.id })) ?? []}
              multiple
              label={t('table.invitees')}
              disabled={isPending}
              error={errors.inviteeIds}
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

function DeleteTable({ id, name }: { id: TableModel['id'], name: ReactNode }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const { mutate, isPending } = useDeleteTable(id);

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
        title={t('table.actions.delete.title')}
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
                onSuccess: async () => {
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
          {t('table.actions.delete.text', { name })}
        </p>
      </Modal>
    </>
  );
}

export default function ListTables() {
  const { t } = useTranslation('app');

  const tables = useTables();
  const users = useUsers();
  const invitees = useInvitees();

  const columns = useMemo(() => [
    {
      key: 'name',
      title: t('table.name'),
    },
    {
      key: 'seats',
      title: t('table.seats'),
    },
    {
      key: 'inviteeIds',
      title: t('table.invitees'),
      render: (inviteeIds) => {
        return invitees.data?.records
          .filter((user) => inviteeIds.includes(user.id))
          .map((invitee) => `${invitee.firstname} ${invitee.lastname}`)
          .join(', ');
      },
    },
    {
      key: 'actions',
      title: <span className="sr-only">{t('table.actions')}</span>,
      render: (actions, record) => (
        <div className="flex space-x-4">
          {actions?.update && (
            <UpdateTable record={record} />
          )}
          {actions?.delete && (
            <DeleteTable id={record.id} name={record.name} />
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t, invitees.data?.records]);

  if (tables.data && users.data && invitees.data) {
    return (
      <>
        <div className="flex justify-end mb-2">
          <CreateTable />
        </div>
        <Table rowKey="id" columns={columns} dataSource={tables.data.records} />
      </>
    );
  }

  if (tables.isError || users.isError || invitees.isError) {
    const error: string[] = [];
    if (users.error) error.push(users.error.message);
    if (tables.error) error.push(tables.error.message);
    if (invitees.error) error.push(invitees.error.message);
    throw new Error(error.join('\n'));
  }

  return <BigSpinner />;
}
