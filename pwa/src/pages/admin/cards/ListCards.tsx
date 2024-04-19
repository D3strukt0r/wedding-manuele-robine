import Table, {TableProps} from '../../../components/common/admin/Table.tsx';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import BigSpinner from '../../../layout/BigSpinner.tsx';
import useCards from '../../../hooks/useCards.ts';
import useInvitees from '../../../hooks/useInvitees.ts';
import useUsers from '../../../hooks/useUsers.ts';

export default function ListInvitees() {
  const {t} = useTranslation('app');

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

  if (cards.data && invitees.data && users.data) {
    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={cards.data.records}
      />
    );
  }

  if (cards.isError || invitees.isError || users.isError) {
    if (cards.isError && invitees.error && users.isError) throw new Error(`${cards.error}\n${invitees.error}\n${users.error}`);
    if (cards.error) throw cards.error;
    if (invitees.error) throw invitees.error;
    if (users.error) throw users.error;
  }

  return <BigSpinner />;
}
