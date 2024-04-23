import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import { User } from '../../../components/types';
import useUsers from '../../../hooks/useUsers';
import useLookupType, { EnumTypes } from '../../../hooks/useLookupType';
import Modal from '../../../components/common/admin/Modal';
import useUserDelete from '../../../hooks/useUserDelete';

function DeleteAction({ record }: { record: User }) {
  const { t } = useTranslation('app');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteUser = useUserDelete(record.id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
      >
        {t('actions.delete')}
        <span className="sr-only">, {record.username}</span>
      </button>
      <Modal
        type="warning"
        title={t('user.action.delete.title')}
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
                await deleteUser.mutateAsync();
                await queryClient.invalidateQueries({ queryKey: ['users'] });
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
          {t('user.action.delete.text', { username: record.username })}
        </p>
      </Modal>
    </>
  );
}

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
          {actions?.update && null}
          {actions?.delete && (
            <DeleteAction record={record} />
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
