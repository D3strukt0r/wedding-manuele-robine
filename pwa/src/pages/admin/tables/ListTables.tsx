import Table, {TableProps} from '../../../components/common/admin/Table.tsx';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import BigSpinner from '../../../layout/BigSpinner.tsx';
import useUsers from '../../../hooks/useUsers.ts';
import useTables from '../../../hooks/useTables.ts';

export default function ListTables() {
  const {t} = useTranslation('app');

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
              {t('actions.edit')}<span className="sr-only">, {record.id}</span>
            </a>
          )}
          {actions?.delete && (
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.delete')}<span className="sr-only">, {record.id}</span>
            </a>
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t]);

  if (tables.data && users.data) {
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tables.data.records}
      />
    );
  }

  if (tables.isError || users.isError) {
    if (users.error && tables.error) throw new Error(`${users.error}\n${tables.error}`);
    if (users.error) throw users.error;
    if (tables.error) throw tables.error;
  }

  return <BigSpinner />;
}
