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
import Input from '#/form/admin/Input';
import { User } from '#/components/types';
import useLookupType, { EnumTypes } from '#/api/common/lookup/useLookupType';
import useUsers from '#/api/admin/user/useUsers';
import useDeleteUser from '#/api/admin/user/useDeleteUser';
import useUpdateUser from '#/api/admin/user/useUpdateUser';

type Inputs = {
  username: string;
  newPassword: string | null;
  // TODO: roles: string[];
};

function UpdateUser({ record }: { record: User }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

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

  const updateUser = useUpdateUser(record.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: record.username,
      newPassword: null,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback((data) => {
    updateUser.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        // TODO: Notification about possibly new generated password
      },
    });
  }, [updateUser, setOpen]);

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
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!updateUser.isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.update'),
            layout: 'primary',
            loading: updateUser.isPending,
            disabled: !isDirty || !isValid,
            ref: saveButtonRef,
            onClick: () => {
              handleSubmit(onSubmit)();
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: updateUser.isPending,
            onClick: () => {
              if (!updateUser.isPending) setOpen(false);
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
              disabled={updateUser.isPending}
              required
            />
            {errors.username?.message && <span>{errors.username.message}</span>}
          </div>
          <div>
            <Input
              {...register('newPassword', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.newPassword')}
              disabled={updateUser.isPending}
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
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const deleteUser = useDeleteUser(record.id);

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
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!deleteUser.isPending) setOpen(false);
        }}
        actions={[
          {
            text: t('actions.delete'),
            layout: 'danger',
            loading: deleteUser.isPending,
            ref: saveButtonRef,
            onClick: () => {
              deleteUser.mutate(undefined, {
                onSuccess: async () => {
                  setOpen(false);
                },
              });
            },
          },
          {
            text: t('actions.cancel'),
            layout: 'secondary',
            disabled: deleteUser.isPending,
            onClick: () => {
              if (!deleteUser.isPending) setOpen(false);
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
