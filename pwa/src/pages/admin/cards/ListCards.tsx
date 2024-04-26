import { ReactNode, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Table, { TableProps } from '#/components/common/admin/Table';
import BigSpinner from '#/layout/BigSpinner';
import Modal from '#/components/common/admin/Modal';
import Alert from '#/components/common/admin/Alert';
import { Card } from '#/components/types';
import useCards from '#/api/admin/cards/useCards';
import useDeleteCard from '#/api/admin/cards/useDeleteCard';
import useUpdateCard from '#/api/admin/cards/useUpdateCard';
import useInvitees from '#/api/admin/invitee/useInvitees';
import useUsers from '#/api/admin/user/useUsers';
import Button from '#/form/admin/Button';
import useCreateCard from '#/api/admin/cards/useCreateCard';
import { setErrorFromSymfonyViolations } from '#/utils/form';
import Select from '#/form/admin/Select';

function CreateCard() {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const users = useUsers();

  const schema = useMemo(() => {
    return z.object({
      userLoginId: z.nullable(z.number()),
      // TODO: inviteeIds: (Invitee['id'])[] | null;
    });
  }, [t]);

  type Inputs = z.infer<typeof schema>;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      userLoginId: null,
    },
  });

  const { mutate, isPending, isError, error } = useCreateCard({
    onSuccess: () => {
      setOpen(false);
      reset();
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(schema, setError, error.response?.data?.violations)
    }
  });

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
      >
        {t('card.actions.create.title')}
      </Button>
      <Modal
        title={t('card.actions.create.title')}
        initialFocus={saveButtonRef}
        open={open}
        onClose={() => {
          if (!isPending) {
            setOpen(false);
            reset();
          }
        }}
        actions={[
          {
            text: t('actions.create'),
            layout: 'primary',
            loading: isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(mutate)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: isPending,
            onClick: () => {
              if (!isPending) {
                setOpen(false);
                reset();
              }
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response?.data?.title}</p>}
            />
          ) : null}
          <div>
            <Select<Inputs>
              name="userLoginId"
              control={control}
              options={users.data?.records?.map((user) => ({label: `${user.username} (ID: ${user.id})`, value: user.id})) ?? []}
              nullable
              label={t('card.userLogin')}
              disabled={isPending}
              error={errors.userLoginId}
            />
          </div>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function UpdateCard({ record }: { record: Card }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const users = useUsers();

  const schema = useMemo(() => {
    return z.object({
      userLoginId: z.nullable(z.number()),
      // TODO: inviteeIds: (Invitee['id'])[] | null;
    });
  }, [t]);

  type Inputs = z.infer<typeof schema>;
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      userLoginId: record.userLoginId,
    },
  });

  const { mutate, isPending, isError, error } = useUpdateCard(record.id, {
    onSuccess: () => {
      setOpen(false);
      reset();
    },
    onError: (error) => {
      setErrorFromSymfonyViolations(schema, setError, error.response?.data?.violations)
    }
  });

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
        onClose={() => {
          if (!isPending) {
            setOpen(false);
            reset();
          }
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading: isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(mutate)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: isPending,
            onClick: () => {
              if (!isPending) {
                setOpen(false);
                reset();
              }
            },
          },
        ]}
      >
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response?.data?.title}</p>}
            />
          ) : null}
          <div>
            <Select<Inputs>
              name="userLoginId"
              control={control}
              options={users.data?.records?.map((user) => ({label: `${user.username} (ID: ${user.id})`, value: user.id})) ?? []}
              nullable
              label={t('card.userLogin')}
              disabled={isPending}
              error={errors.userLoginId}
            />
          </div>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function DeleteCard({ id, name }: { id: Card['id'], name: ReactNode }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const { mutate, isPending } = useDeleteCard(id);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-900"
      >
        {t('actions.delete')}
        <span className="sr-only">, {name}</span>
      </button>
      <Modal
        type="warning"
        title={t('card.actions.delete.title')}
        initialFocus={saveButtonRef}
        open={open}
        onClose={() => {
          if (!isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.delete'),
            layout: 'danger',
            loading: isPending,
            ref: saveButtonRef,
            onClick: () => {
              mutate(undefined, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: isPending,
            onClick: () => {
              if (!isPending) setOpen(false);
            },
          },
        ]}
      >
        <p className="text-sm text-gray-500">
          {t('card.actions.delete.text', { name })}
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
            <DeleteCard id={record.id} name={record.id} />
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t]);

  if (cards.data && invitees.data && users.data) {
    return (
      <>
        <div className="flex justify-end mb-2">
          <CreateCard />
        </div>
        <Table rowKey="id" columns={columns} dataSource={cards.data.records} />
      </>
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
