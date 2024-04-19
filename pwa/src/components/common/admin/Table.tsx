import clsx from 'clsx';
import {ReactNode} from 'react';

export interface TableProps {
  columns: {
    key: string;
    title: ReactNode;
    align?: 'left' | 'center' | 'right';
    render?: (text: any, record: any) => ReactNode;
  }[];
  dataSource: {
    [key: string]: any;
  }[];
  rowKey: string | ((record: any) => string);
}
export default function Table({columns, dataSource, rowKey}: TableProps) {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {columns.map(({key, title, ...column}, index) => {
                  const align = column.align ?? 'left';
                  const isFirst = index === 0;
                  const isLast = index === columns.length - 1;
                  return (
                    <th
                      key={key}
                      scope="col"
                      className={clsx(
                        'py-3.5 text-sm font-semibold text-gray-900',
                        {
                          'text-left': align === 'left',
                          // 'text-center': align === 'center', // Browser default
                          'text-right': align === 'right',
                        },
                        {
                          'pl-4 pr-3 sm:pl-0': isFirst,
                          'px-3': !isFirst && !isLast,
                          'pl-3 pr-4 sm:pr-0': isLast,
                          // TODO: Only 1 element first and last
                        }
                      )}
                    >
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataSource.map((data) => {
                return (
                  <tr key={typeof rowKey === 'string' ? data[rowKey] : rowKey(data)}>
                    {columns.map(({key, render, ...column}, index) => {
                      const align = column.align ?? 'left';
                      const isFirst = index === 0;
                      const isLast = index === columns.length - 1;
                      return (
                        <td
                          key={key}
                          className={clsx(
                            'whitespace-nowrap text-sm py-4',
                            {
                              // 'text-left': align === 'left', // Browser default
                              'text-center': align === 'center',
                              'text-right': align === 'right',
                            },
                            {
                              'pl-4 pr-3 font-medium text-gray-900 sm:pl-0': isFirst,
                              'px-3 text-gray-500': !isFirst && !isLast,
                              'pl-3 pr-4 font-medium sm:pr-0': isLast,
                              // TODO: Only 1 element first and last
                            },
                          )}
                        >
                          {render ? render(data[key], data) : data[key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
