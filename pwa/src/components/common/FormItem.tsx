import { Control, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form/dist/types';
import { cloneElement, isValidElement, ReactNode } from 'react';
import _ from 'lodash';
import { useController } from 'react-hook-form';
import { UseControllerReturn } from 'react-hook-form/dist/types/controller';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

// in library written as type, we just rewrite as interface because typescript becomes weird
interface UseControllerProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  name: TName;
  rules?: Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  shouldUnregister?: boolean;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  control?: Control<TFieldValues>;
  disabled?: boolean;
}

interface FormItemProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends UseControllerProps<TFieldValues, TName> {
  children: ReactNode | ((controller: UseControllerReturn<TFieldValues, TName>) => ReactNode);
}
export default function FormItem<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: FormItemProps<TFieldValues, TName>) {
  const useControllerProps = _.omit(props, [
    'children',
  ]);
  const controller = useController<TFieldValues, TName>(useControllerProps);

  return typeof props.children === 'function'
    ? props.children(controller)
    : isValidElement(props.children)
    ? cloneElement(props.children, controller.field)
    : null;
}
