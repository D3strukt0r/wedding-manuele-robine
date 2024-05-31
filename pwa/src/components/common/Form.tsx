import { FormProvider, useForm, UseFormProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import _ from 'lodash';
import { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { DevTool } from '@hookform/devtools';

interface FormProps<TFieldValues extends FieldValues = FieldValues, TContext = any> extends UseFormProps<TFieldValues, TContext>, DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {}
export default function Form<TFieldValues extends FieldValues = FieldValues, TContext = any>(props: FormProps<TFieldValues, TContext>) {
  const useFormProps = [
    // https://react-hook-form.com/docs/useform
    'mode',
    'reValidateMode',
    'defaultValues',
    'values',
    'errors',
    'resetOptions',
    'criteriaMode',
    'shouldFocusError',
    'delayError',
    'shouldUseNativeValidation',
    'shouldUnregister',
    'resolver',
    'context',
  ];
  const methods = useForm<TFieldValues, TContext>(_.pick(props, ...useFormProps));

  return (
    <FormProvider {...methods}>
      <form
        {..._.omit(props, ...useFormProps, 'onSubmit')}
        {...(props.onSubmit ? { onSubmit: methods.handleSubmit(props.onSubmit) } : {})}
      />
      {import.meta.env.DEV && (
        <DevTool control={methods.control} />
      )}
    </FormProvider>
  );
}
