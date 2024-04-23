import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import useCards from '../../../hooks/useCards';
import useInvitees from '../../../hooks/useInvitees';
import useUsers from '../../../hooks/useUsers';
import { Card } from '../../../components/types';
import Modal from '../../../components/common/admin/Modal';
import useCardDelete from '../../../hooks/useCardDelete';

function DeleteAction({ record }: { record: Card }) {
  const { t } = useTranslation('app');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteCard = useCardDelete(record.id);

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
        title={t('card.actions.delete.title')}
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
                await deleteCard.mutateAsync();
                await queryClient.invalidateQueries({ queryKey: ['cards'] });
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
          {t('card.actions.delete.text', { id: record.id })}
        </p>
      </Modal>
    </>
  );
}

export default function ListInvitees() {
  const { t } = useTranslation('app');

  const cards = useCards();
  const invitees = useInvitees();
  const users = useUsers();

  const columns = useMemo(() => [
    {
      key: 'userLoginId',
      title: t('card.userLogin'),
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

  if (cards.data && invitees.data && users.data) {
    return (
      <Table rowKey="id" columns={columns} dataSource={cards.data.records} />
    );
  }

  if (cards.isError || invitees.isError || users.isError) {
    const error: string[] = [];
    if (cards.error) error.push(cards.error.message);
    if (invitees.error) error.push(invitees.error.message);
    if (users.error) error.push(users.error.message);
    throw new Error(error.join('\n'));
  }

  return <BigSpinner />;
}
