import Table, {TableProps} from '../../../components/common/admin/Table.tsx';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import BigSpinner from '../../../layout/BigSpinner.tsx';
import useTables from '../../../hooks/useTables.ts';
import useCards from '../../../hooks/useCards.ts';
import useInvitees from '../../../hooks/useInvitees.ts';
import useEnumFood from '../../../hooks/useEnumFood.ts';

export default function ListInvitees() {
  const {t} = useTranslation('app');

  const invitees = useInvitees();
  const tables = useTables();
  const cards = useCards();
  const food = useEnumFood();

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

  if (invitees.data && tables.data && cards.data && food.data) {
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={invitees.data.records}
      />
    );
  }

  if (invitees.isError || tables.isError || cards.isError || food.isError) {
    if (invitees.error && tables.error && cards.isError && food.isError) throw new Error(`${invitees.error}\n${tables.error}\n${cards.error}\n${food.error}`);
    if (invitees.error) throw invitees.error;
    if (tables.error) throw tables.error;
    if (cards.error) throw cards.error;
    if (food.error) throw food.error;
  }

  return <BigSpinner />;
}
