import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import useUsers from '../../../hooks/useUsers';
import useTables from '../../../hooks/useTables';

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
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.edit')}
              <span className="sr-only">, {record.id}</span>
            </a>
          )}
          {actions?.delete && (
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.delete')}
              <span className="sr-only">, {record.id}</span>
            </a>
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
