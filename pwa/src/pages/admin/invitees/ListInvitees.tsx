import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import useTables from '../../../hooks/useTables';
import useCards from '../../../hooks/useCards';
import useInvitees from '../../../hooks/useInvitees';
import useLookupType, { EnumTypes } from '../../../hooks/useLookupType';

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
