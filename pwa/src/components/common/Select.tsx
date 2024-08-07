import { Fragment, ReactNode, useState } from 'react';
import { Combobox, ComboboxProps } from '@headlessui/react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDown, faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FieldError, Merge, useController, UseControllerProps } from 'react-hook-form';
import { ComboboxInputProps } from '@headlessui/react/dist/components/combobox/combobox';
import { FieldValues } from 'react-hook-form/dist/types';
import { Float } from '@headlessui-float/react';
import { useTranslation } from 'react-i18next';
import { limitShift } from '@floating-ui/react';

interface Props<TFieldValues extends FieldValues> extends ComboboxInputProps, UseControllerProps<TFieldValues> {
  label?: ReactNode;
  options: {
    label: string;
    value: string | number;
  }[];
  error?: Merge<FieldError, (FieldError | undefined)[]>;
  className?: HTMLInputElement['className'];
  disabled?: HTMLInputElement['disabled'];
  nullable?: ComboboxProps<any, any, any, any>['nullable'];
  multiple?: ComboboxProps<any, any, any, any>['multiple'];
}

// Float example taken from: https://github.com/ycs77/headlessui-float/blob/main/examples/example-react-ts/src/pages/combobox.tsx

const Select = <TFieldValues extends FieldValues>({
  label,
  options,
  error,
  control,
  name,
  nullable,
  multiple,
  ...props
}: Props<TFieldValues>) => {
  const { t } = useTranslation('app');
  const { field } = useController({ control, name });

  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) => {
        return option.label.toLowerCase().includes(query.toLowerCase())
      });

  // Can't use register and it's onChange function, as it expects an event object (will fail accessing 'event.target.name')
  return (
    <Combobox
      as={Fragment}
      value={multiple && !nullable ? (field.value ?? []) : field.value}
      onChange={(optionOrOptions) => field.onChange(optionOrOptions)}
      nullable={nullable}
      multiple={multiple}
    >
      {label && (
        <Combobox.Label className="block font-medium leading-6 text-gray-900">
          {label}
        </Combobox.Label>
      )}
      <Float
        as="div"
        className={clsx('relative', { 'mt-2': label })}
        placement="bottom-start"
        offset={4}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        floatingAs={Fragment}
        onHide={() => setQuery('')}
        portal
        adaptiveWidth // calculates width with JS, required because of "portal" TODO: Only use when necessary (in modals)
        shift={{
          crossAxis: true,
          limiter: limitShift(),
          padding: 4 + 4,
        }}
      >
        <div className="relative w-full">
          <Combobox.Input
            {...props}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
            className={clsx(
              props.className,
              'w-full rounded-md border-0 py-1.5 pl-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
              {
                'bg-white text-gray-900': !props.disabled,
                'bg-gray-300 text-gray-600 placeholder:text-gray-500': props.disabled,
                'pr-8 ring-gray-300 focus:ring-blue-600': !error,
                'pr-14 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500': error,
              },
            )}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(value) => {
              if (multiple) {
                return value.map((v) => options.find((option) => option.value === v)?.label).join(', ');
              }
              return options.find((option) => option.value === value)?.label ?? '';

            }}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${field.name}-error` : undefined}
          />
          {error ? (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8">
              <FontAwesomeIcon icon={faCircleExclamation} className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          ) : <></>}

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <FontAwesomeIcon icon={faArrowsUpDown} className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.length === 0 && query !== '' ? (
            <div className="relative py-2 px-4 text-gray-700 cursor-default select-none">
              {t('form.select.nothingFound')}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option.value}
                className={({ active }) => clsx(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active ? 'bg-blue-600 text-white' : 'text-gray-900',
                )}
              >
                {({ active, selected }) => (
                  <>
                    <span className={clsx('block truncate', selected && 'font-semibold')}>{option.label}</span>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-blue-600',
                        )}
                      >
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Float>
      {error && (
        <div className="mt-2 text-sm text-red-600" id={`${field.name}-error`}>
          {error.types ? Object.entries(error.types).map(([type, message]) => (
            <p key={type}>{message}</p>
          )) : (
            <p>{error.message}</p>
          )}
        </div>
      )}
    </Combobox>
  );
};

export default Select;
