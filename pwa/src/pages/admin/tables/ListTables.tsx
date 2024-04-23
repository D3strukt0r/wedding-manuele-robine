import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import useUsers from '../../../hooks/useUsers';
import useTables from '../../../hooks/useTables';
import { Table as TableModel } from '../../../components/types';
import Modal from '../../../components/common/admin/Modal';
import useTableDelete from '../../../hooks/useTableDelete';

function DeleteAction({ record }: { record: TableModel }) {
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
        title={t('table.action.delete.title')}
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
          {t('table.action.delete.text', { id: record.id })}
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
          {actions?.update && null}
          {actions?.delete && (
            <DeleteAction record={record} />
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
