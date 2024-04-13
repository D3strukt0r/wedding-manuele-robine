import {useTranslation} from "react-i18next";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useCallback, useContext, useMemo} from "react";
import * as z from "zod";
import {api} from "../api.ts";
import AuthenticationContext from "../../context/AuthenticationContext.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Input from '../../form/admin/Input.tsx';
import Button from '../../form/admin/Button.tsx';
import {DevTool} from '@hookform/devtools';

type Inputs = {
  username: string
  password: string
}

export default function Login() {
  const {t} = useTranslation('app');
  const [, updateAuthentication] = useContext(AuthenticationContext);

  const schema = useMemo(() => {
    return z.object({
      username: z.string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') })
        .max(180, { message: t('form.errors.max', { max: 180 }) }),
      password: z.string({ required_error: t('form.errors.required') })
        .min(1, { message: t('form.errors.required') }),
    });
  }, [t]);

  const login = useMutation({
    mutationFn: api.common.login,
    onSuccess: async (response) => {
      // Invalidate and re-fetch
      updateAuthentication(response.token);
    },
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    login.mutate(data);
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
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t('admin.login.username')}
            </label>
            <div className="mt-2">
              <Input
                {...register('username')}
                autoComplete="username"
                required
              />
              {errors.username?.message && <span>{errors.username.message}</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('admin.login.password')}
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {t('admin.login.forgotPassword')}
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <Button type="submit" loading={login.isPending} className="w-full">{t('admin.login.login')}</Button>
        </form>
        {import.meta.env.MODE === 'development' && (
          <DevTool control={control} />
        )}
      </div>
    </div>
  );
}
