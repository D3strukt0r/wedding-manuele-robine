import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Table, { TableProps } from '#/components/common/admin/Table';
import BigSpinner from '#/layout/BigSpinner';
import Modal from '#/components/common/admin/Modal';
import Alert from '#/components/common/admin/Alert';
import { Card, Invitee, User } from '#/components/types';
import useCards from '#/api/admin/cards/useCards';
import useDeleteCard from '#/api/admin/cards/useDeleteCard';
import useUpdateCard from '#/api/admin/cards/useUpdateCard';
import useInvitees from '#/api/admin/invitee/useInvitees';
import useUsers from '#/api/admin/user/useUsers';

type Inputs = {
  // TODO: userLoginId: User['id'];
  // TODO: inviteeIds: (Invitee['id'])[]
};

function UpdateCard({ record }: { record: Card }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const schema = useMemo(() => {
    return z.object({
      // TODO: userLoginId
      // TODO: inviteeIds
    });
  }, [t]);

  const updateCard = useUpdateCard(record.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    updateCard.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }, [updateCard, setOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-900"
      >
        {t('actions.update')}
        <span className="sr-only">, {record.id}</span>
      </button>
      <Modal
        title={t('card.actions.update.title')}
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!updateCard.isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading: updateCard.isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(onSubmit)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: updateCard.isPending,
            onClick: () => {
              if (!updateCard.isPending) setOpen(false);
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {updateCard.isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{updateCard.error.response.data.message}</p>}
            />
          ) : null}
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function DeleteCard({ record }: { record: Card }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const deleteCard = useDeleteCard(record.id);

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
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!deleteCard.isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.delete'),
            layout: 'danger',
            loading: deleteCard.isPending,
            ref: saveButtonRef,
            onClick: () => {
              deleteCard.mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: deleteCard.isPending,
            onClick: () => {
              if (!deleteCard.isPending) setOpen(false);
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
          {actions?.update && (
            <UpdateCard record={record} />
          )}
          {actions?.delete && (
            <DeleteCard record={record} />
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
