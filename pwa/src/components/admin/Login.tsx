import { useTranslation } from 'react-i18next';
import { useCallback, useContext, useMemo } from 'react';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import AuthenticationContext from '#/context/AuthenticationContext';
import Input from '#/form/admin/Input';
import Button from '#/form/admin/Button';
import Alert from '#/components/common/admin/Alert';
import useLogin from '#/api/common/authentication/useLogin';

type Inputs = {
  username: string;
  password: string;
};

export default function Login() {
  const { t } = useTranslation('app');
  const [, updateAuthentication] = useContext(AuthenticationContext);

  const schema = useMemo(() => {
    return z.object({
      username: z
        .string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') })
        .max(180, { message: t('form.errors.max', { max: 180 }) }),
      password: z
        .string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') }),
    });
  }, [t]);

  const login = useLogin();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: null,
      password: null,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    login.mutate(data, {
      onSuccess: (response) => {
        updateAuthentication(response.token);
      },
    });
  }, [login]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {t('admin.login.title')}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {login.isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{login.error.response.data.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('username', { setValueAs: (value) => value === '' ? null : value })}
              label={t('admin.login.username')}
              disabled={login.isPending}
              autoComplete="username"
              required
            />
            {errors.username?.message && <span>{errors.username.message}</span>}
          </div>

          <div>
            <Input
              {...register('password', { setValueAs: (value) => value === '' ? null : value })}
              type="password"
              label={t('admin.login.password')}
              // extra={(
              //   <div className="text-sm">
              //     <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
              //       {t('admin.login.forgotPassword')}
              //     </a>
              //   </div>
              // )}
              disabled={login.isPending}
              autoComplete="current-password"
              required
            />
            {errors.password?.message && <span>{errors.password.message}</span>}
          </div>
          <Button type="submit" loading={login.isPending} disabled={!isDirty || !isValid} className="w-full">
            {t('admin.login.login')}
          </Button>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </div>
    </div>
  );
}
