import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import useTables from '../../../hooks/useTables';
import useCards from '../../../hooks/useCards';
import useInvitees from '../../../hooks/useInvitees';
import useLookupType, { EnumTypes } from '../../../hooks/useLookupType';
import { Invitee } from '../../../components/types';
import Modal from '../../../components/common/admin/Modal';
import useInviteeDelete from '../../../hooks/useInviteeDelete';

function DeleteAction({ record }: { record: Invitee }) {
  const { t } = useTranslation('app');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteInvitee = useInviteeDelete(record.id);

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
        title={t('invitee.action.delete.title')}
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
                await deleteInvitee.mutateAsync();
                await queryClient.invalidateQueries({ queryKey: ['invitees'] });
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
          {t('invitee.action.delete.text', { firstname: record.firstname, lastname: record.lastname })}
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
          {actions?.update && null}
          {actions?.delete && (
            <DeleteAction record={record} />
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
