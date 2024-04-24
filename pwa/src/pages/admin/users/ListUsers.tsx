import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import Table, { TableProps } from '../../../components/common/admin/Table';
import BigSpinner from '../../../layout/BigSpinner';
import { User } from '../../../components/types';
import useUsers from '../../../hooks/useUsers';
import useLookupType, { EnumTypes } from '../../../hooks/useLookupType';
import Modal from '../../../components/common/admin/Modal';
import useUserDelete from '../../../hooks/useUserDelete';
import Alert from '../../../components/common/admin/Alert';
import Input from '../../../form/admin/Input';
import useUserUpdate from '../../../hooks/useUserUpdate';

type Inputs = {
  username: string;
  newPassword: string | null;
  // TODO: roles: string[];
};

function UpdateUser({ record }: { record: User }) {
  const { t } = useTranslation('app');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = useMemo(() => {
    return z.object({
      username: z
        .string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') })
        .max(180, { message: t('form.errors.max', { max: 180 }) }),
      newPassword: z.nullable(
        z.union([
          z.string(),
          z.string().length(0),
        ]),
      ),
      // TODO: roles
    });
  }, [t]);

  const updateUser = useUserUpdate(record.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: record,
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    setLoading(true);
    try {
      await updateUser.mutateAsync(data);
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [updateUser, queryClient]);

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
        title={t('user.actions.update.title')}
        open={open}
        setOpen={() => {
          if (!loading) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading,
            onClick: () => {
              handleSubmit(onSubmit)();
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {updateUser.isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{updateUser.error.response.data.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('username', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.username')}
              placeholder={record.username}
              required
            />
            {errors.username?.message && <span>{errors.username.message}</span>}
          </div>
          <div>
            <Input
              {...register('newPassword', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.newPassword')}
            />
            {errors.newPassword?.message && <span>{errors.newPassword.message}</span>}
          </div>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </Modal>
    </>
  );
}

function DeleteUser({ record }: { record: User }) {
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
        title={t('user.actions.delete.title')}
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
          {t('user.actions.delete.text', { username: record.username })}
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
          {actions?.update && (
            <UpdateUser record={record} />
          )}
          {actions?.delete && (
            <DeleteUser record={record} />
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
