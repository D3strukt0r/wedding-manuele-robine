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
import Input from '#/form/admin/Input';
import Button from '#/form/admin/Button';
import { User } from '#/components/types';
import useLookupType, { EnumTypes } from '#/api/common/lookup/useLookupType';
import useUsers from '#/api/admin/user/useUsers';
import useDeleteUser from '#/api/admin/user/useDeleteUser';
import useUpdateUser from '#/api/admin/user/useUpdateUser';
import useCreateUser from '#/api/admin/user/useCreateUser';
import { setErrorFromSymfonyViolations } from '#/utils/form.ts';

function CreateUser() {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const schema = useMemo(() => {
    return z.object({
      username: z
        .string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') })
        .max(180, { message: t('form.errors.max', { max: 180 }) }),
      password: z.nullable(
        z.union([
          z.string(),
          z.string().length(0),
        ]),
      ),
      // TODO: roles: string[] | null;
    });
  }, [t]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: null,
      password: null,
    },
  });

  const { mutate, isPending, isError, error } = useCreateUser({
    onSuccess: () => {
      setOpen(false);
      reset();
      // TODO: Notification about possibly new generated password
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
        {t('user.actions.create.title')}
      </Button>
      <Modal
        title={t('user.actions.create.title')}
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!isPending) setOpen(false);
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
              if (!isPending) setOpen(false);
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
            <Input
              {...register('username', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.username')}
              disabled={isPending}
              error={errors.username}
              required
            />
          </div>
          <div>
            <Input
              {...register('password', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.password')}
              disabled={isPending}
              error={errors.password}
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
      // TODO: roles: string[] | null;
    });
  }, [t]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: record.username,
      newPassword: null,
    },
  });

  const { mutate, isPending, isError, error } = useUpdateUser(record.id, {
    onSuccess: () => {
      setOpen(false);
      reset();
      // TODO: Notification about possibly new generated password
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
        title={t('user.actions.update.title')}
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
          if (!isPending) setOpen(false);
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
              if (!isPending) setOpen(false);
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
            <Input
              {...register('username', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.username')}
              placeholder={record.username}
              disabled={isPending}
              error={errors.username}
              required
            />
          </div>
          <div>
            <Input
              {...register('newPassword', { setValueAs: (value) => value === '' ? null : value })}
              label={t('user.newPassword')}
              disabled={isPending}
              error={errors.newPassword}
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

function DeleteUser({ id, name }: { id: User['id'], name: ReactNode }) {
  const { t } = useTranslation('app');
  const [open, setOpen] = useState(false);
  const saveButtonRef = useRef<null | HTMLButtonElement>(null);

  const { mutate, isPending } = useDeleteUser(id);

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
        title={t('user.actions.delete.title')}
        initialFocus={saveButtonRef}
        open={open}
        setOpen={() => {
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
                onSuccess: async () => {
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
          {t('user.actions.delete.text', { name })}
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
            <DeleteUser id={record.id} name={record.username} />
          )}
        </div>
      ),
    },
  ] satisfies TableProps['columns'], [t]);

  if (users.data && roles.data) {
    return (
      <>
        <div className="flex justify-end mb-2">
          <CreateUser />
        </div>
        <Table rowKey="id" columns={columns} dataSource={users.data.records} />
      </>
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
