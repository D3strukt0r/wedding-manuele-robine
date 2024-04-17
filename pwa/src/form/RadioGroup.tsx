import clsx from "clsx";
import { InputHTMLAttributes } from "react";

interface Option extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  value: Exclude<InputHTMLAttributes<HTMLInputElement>['value'], readonly string[]>;
}
interface Props {
  label?: string;
  legend?: string;
  inline?: boolean;
  options: Option[];
}
export default function RadioGroup({label, legend, inline = false, options}: Props) {
  return (
    <div>
      {label && (
        <label className="text-base noto-sans-regular text-gray-900">{label}</label>
      )}
      <fieldset>
        {legend && (
          <legend className="sr-only">{legend}</legend>
        )}
        <div className={clsx('space-y-4', {'sm:flex sm:items-center sm:space-x-10 sm:space-y-0': inline})}>
          {options.map(({title, ...props}) => (
            <div key={props.value} className="flex items-center">
              <input
                // defaultChecked={option.id === 'email'}
                {...props}
                id={`${props.name}.${props.value}`}
                className={clsx(
                  props.className,
                  'h-4 w-4 border-gray-300 text-app-red-dark focus:ring-app-red-dark',
                )}
                type="radio"
              />
              <label htmlFor={`${props.name}.${props.value}`} className="ml-3 block text-sm noto-sans-regular leading-6 text-gray-900">
                {title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
