import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import { User } from '../../../components/types';
import useUsers from '../../../hooks/useUsers';
import useLookupType, { EnumTypes } from '../../../hooks/useLookupType';

export default function ListUsers() {
  const { t } = useTranslation('app');

  const users = useUsers();
  const roles = useLookupType(EnumTypes.ROLE);

  const columns = useMemo(() => [
    {
      key: 'username',
      title: t('user.username'),
    },
    {
      key: 'roles',
      title: t('user.roles'),
      render: (roles: User['roles']) =>
        roles.map((role) => t(`enum.role.${role}`)).join(', '),
    },
    {
      key: 'actions',
      title: <span className="sr-only">{t('table.actions')}</span>,
      render: (actions, record) => (
        <div className="flex space-x-4">
          {actions?.update && (
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.edit')}
              <span className="sr-only">, {record.username}</span>
            </a>
          )}
          {actions?.delete && (
            <a href="#" className="text-blue-600 hover:text-blue-900">
              {t('actions.delete')}
              <span className="sr-only">, {record.username}</span>
            </a>
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t]);

  if (users.data && roles.data) {
    return (
      <Table rowKey="id" columns={columns} dataSource={users.data.records} />
    );
  }

  if (users.isError || roles.isError) {
    const error: string[] = [];
    if (users.error) error.push(users.error.message);
    if (roles.error) error.push(roles.error.message);
    throw new Error(error.join('\n'));
  }

  return <BigSpinner />;
}
