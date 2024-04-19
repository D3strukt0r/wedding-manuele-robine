import Table, {TableProps} from '../../../components/common/admin/Table.tsx';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import BigSpinner from '../../../layout/BigSpinner.tsx';
import {User} from '../../../components/types.ts';
import useUsers from '../../../hooks/useUsers.ts';
import useEnumRole from '../../../hooks/useEnumRole.ts';

export default function ListUsers() {
  const {t} = useTranslation('app');

  const users = useUsers();
  const roles = useEnumRole();

  const columns = useMemo(() => [
    {
      key: 'username',
      title: t('user.username'),
    },
    {
      key: 'roles',
      title: t('user.roles'),
      render: (roles: User['roles']) => roles.map((role) => t(`enum.role.${role}`)).join(', '),
    },
    {
      key: 'actions',
      title: <span className="sr-only">{t('table.actions')}</span>,
      render: (actions, record) => (
        <div className="flex space-x-4">
          {actions?.update && (
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.edit')}<span className="sr-only">, {record.username}</span>
            </a>
          )}
          {actions?.delete && (
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.delete')}<span className="sr-only">, {record.username}</span>
            </a>
          )}
        </div>
      ),
    }
  ] satisfies TableProps['columns'], [t]);

  if (users.data && roles.data) {
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users.data.records}
      />
    );
  }

  if (users.isError || roles.isError) {
    if (users.error && roles.error) throw new Error(`${users.error}\n${roles.error}`);
    if (users.error) throw users.error;
    if (roles.error) throw roles.error;
  }

  return <BigSpinner />;
}
