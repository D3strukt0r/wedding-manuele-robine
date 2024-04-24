import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import useUsers from '../../../hooks/useUsers';
import useTables from '../../../hooks/useTables';
import { Invitee, Table as TableModel } from '../../../components/types';
import Modal from '../../../components/common/admin/Modal';
import useTableDelete from '../../../hooks/useTableDelete';
import useTableUpdate from '../../../hooks/useTableUpdate';
import Alert from '../../../components/common/admin/Alert';
import Input from '../../../form/admin/Input';

type Inputs = {
  seats: number;
  // TODO: inviteeIds: (Invitee['id'])[];
};

function UpdateTable({ record }: { record: TableModel }) {
  const { t } = useTranslation('app');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = useMemo(() => {
    return z.object({
      seats: z
        .number({ required_error: t('form.errors.required') })
        .min(0, { message: t('form.errors.required') }),
      // TODO: inviteeIds
    });
  }, [t]);

  const updateTable = useTableUpdate(record.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: record,
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    setLoading(true);
    try {
      await updateTable.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: ['tables'] });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [updateTable, queryClient]);

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
        open={open}
        setOpen={() => {
          if (!loading) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading,
            onClick: () => {
              handleSubmit(onSubmit)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            onClick: () => {
              if (!loading) setOpen(false);
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {updateTable.isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{updateTable.error.response.data.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('seats', { valueAsNumber: true })}
              type="number"
              label={t('table.seats')}
              placeholder={`${record.seats}`}
              required
            />
            {errors.seats?.message && <span>{errors.seats.message}</span>}
          </div>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function DeleteTable({ record }: { record: TableModel }) {
  const { t } = useTranslation('app');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteTable = useTableDelete(record.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
      >
        {t('actions.delete')}
        <span className="sr-only">, {record.id}</span>
      </button>
      <Modal
        type="warning"
        title={t('table.actions.delete.title')}
        open={open}
        setOpen={() => {
          if (!loading) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.delete'),
            layout: 'danger',
            loading,
            onClick: async () => {
              setLoading(true);
              try {
                await deleteTable.mutateAsync();
                await queryClient.invalidateQueries({ queryKey: ['tables'] });
                setOpen(false);
              } finally {
                setLoading(false);
              }
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            onClick: () => {
              if (!loading) setOpen(false);
            },
          },
        ]}
      >
        <p className="text-sm text-gray-500">
          {t('table.actions.delete.text', { id: record.id })}
        </p>
      </Modal>
    </>
  );
}

export default function ListTables() {
  const { t } = useTranslation('app');

  const tables = useTables();
  const users = useUsers();

  const columns = useMemo(() => [
    {
      key: 'seats',
      title: t('table.seats'),
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
            <DeleteTable record={record} />
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t]);

  if (tables.data && users.data) {
    return (
      <Table rowKey="id" columns={columns} dataSource={tables.data.records} />
    );
  }

  if (tables.isError || users.isError) {
    const error: string[] = [];
    if (users.error) error.push(users.error.message);
    if (tables.error) error.push(tables.error.message);
    throw new Error(error.join('\n'));
  }

  return <BigSpinner />;
}
