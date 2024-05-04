import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { useAuthenticationContext } from '#/utils/authentication';
import Input from '#/components/common/Input';
import Button from '#/components/common/Button';
import useLogin from '#/api/common/authentication/useLogin';
import Alert from '#/components/common/Alert';

export default function Login() {
  const { t } = useTranslation('app');
  const [, updateAuthentication] = useAuthenticationContext();

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

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: null,
      password: null,
    },
  });

  const { mutate, isPending, isError, error } = useLogin({
    onSuccess: (response) => {
      updateAuthentication(response.token);
      reset();
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {t('admin.login.title')}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(mutate)} className="space-y-6">
          {isError ? (
            <Alert
              type="error"
              title={t('form.errors.general')}
              text={<p>{error.response?.data?.message}</p>}
            />
          ) : null}
          <div>
            <Input
              {...register('username', { setValueAs: (value) => value === '' ? null : value })}
              label={t('admin.login.username')}
              disabled={isPending}
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
              disabled={isPending}
              autoComplete="current-password"
              required
            />
            {errors.password?.message && <span>{errors.password.message}</span>}
          </div>
          <Button type="submit" loading={isPending} disabled={!isDirty || !isValid} className="w-full">
            {t('admin.login.login')}
          </Button>
        </form>
        {import.meta.env.DEV && (
          <DevTool control={control} />
        )}
      </div>
    </div>
  );
}
