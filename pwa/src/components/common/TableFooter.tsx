import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Dispatch, ForwardedRef, forwardRef, ReactElement, SetStateAction, useMemo } from 'react';
import clsx from 'clsx';
import { Markup } from 'interweave';
import Select from '#/components/common/Select.tsx';
import Form from '#/components/common/Form.tsx';
import { useFormContext } from 'react-hook-form';
import FormItem from '#/components/common/FormItem.tsx';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { Optional } from '@tanstack/react-query';

interface Pagination {
  page?: number;
  isPrevious?: boolean;
  isNext?: boolean;
  isCurrent?: boolean;
  isSpacer?: boolean;
  disabled?: boolean;
}

/**
 * https://www.strangerstudios.com/sandbox/pagination/diggstyle.php
 * https://www.strangerstudios.com/sandbox/pagination/diggstyle_function.txt
 */
export function getPaginationPages(page: number, total: number, limit: number, adjacents: number = 1) {
  const lastpage = Math.ceil(total / limit); // lastpage is = total items / items per page, rounded up.
  const lpm1 = lastpage - 1; // last page minus 1

  const pagination: Pagination[] = [];
  let counter = 1;
  if (lastpage > 1) {
    // previous button
    if (page > 1) {
      pagination.push({ isPrevious: true });
    } else {
      pagination.push({ isPrevious: true, disabled: true });
    }

    if (lastpage < 7 + (adjacents * 2)) {
      // not enough pages to bother breaking it up
      for (counter = 1; counter <= lastpage; counter++) {
        if (counter === page) {
          pagination.push({ page: counter, isCurrent: true });
        } else {
          pagination.push({ page: counter });
        }
      }
    } else if (lastpage >= 7 + (adjacents * 2)) {
      // enough pages to hide some
      // close to beginning; only hide later pages
      if (page < 1 + (adjacents * 2)) {
        for (counter = 1; counter < 4 + (adjacents * 2); counter++) {
          if (counter === page) {
            pagination.push({ page: counter, isCurrent: true });
          } else {
            pagination.push({ page: counter });
          }
        }
        pagination.push({ isSpacer: true });
        pagination.push({ page: lpm1 });
        pagination.push({ page: lastpage });
      } else if (lastpage - (adjacents * 2) > page && page > (adjacents * 2)) {
        // in middle; hide some front and some back
        pagination.push({ page: 1 });
        pagination.push({ page: 2 });
        pagination.push({ isSpacer: true });
        for (counter = page - adjacents; counter <= page + adjacents; counter++) {
          if (counter === page) {
            pagination.push({ page: counter, isCurrent: true });
          } else {
            pagination.push({ page: counter });
          }
        }
        pagination.push({ isSpacer: true });
        pagination.push({ page: lpm1 });
        pagination.push({ page: lastpage });
      } else {
        // close to end; only hide early pages
        pagination.push({ page: 1 });
        pagination.push({ page: 2 });
        pagination.push({ isSpacer: true });
        for (counter = lastpage - (1 + (adjacents * 3)); counter <= lastpage; counter++) {
          if (counter === page) {
            pagination.push({ page: counter, isCurrent: true });
          } else {
            pagination.push({ page: counter });
          }
        }
      }
    }
  }

  // next button
  if (page < counter - 1) {
    pagination.push({ isNext: true });
  } else {
    pagination.push({ isNext: true, disabled: true });
  }

  return pagination;
}

interface ItemProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Partial<ControllerRenderProps<TFieldValues, TName>> {}
const InputInternal = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: ItemProps<TFieldValues, TName>, ref: ForwardedRef<HTMLInputElement>) => {
  return <input {...props} ref={ref} />
}
const Input = forwardRef(InputInternal) as <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: ItemProps<TFieldValues, TName> & { ref?: ForwardedRef<HTMLInputElement> }) => ReactElement;

interface Props {
  page: number;
  total: number;
  limit: number;
  adjacents?: number;
  setPage: Dispatch<SetStateAction<number>>;
  setLimit: Dispatch<SetStateAction<number>>;
}
export default function TableFooter({ page, total, limit, adjacents, setPage, setLimit }: Props) {
  const {t} = useTranslation('app');
  const pages = useMemo(() => getPaginationPages(page, total, limit, adjacents), [page, total, limit, adjacents]);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={(e) => {
            e.preventDefault();
            setPage((prevState) => Math.max(prevState - 1, 1));
          }}
        >
          {t('table.previous')}
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={(e) => {
            e.preventDefault();
            setPage((prevState) => Math.min(prevState + 1, Math.ceil(total / limit)));
          }}
        >
          {t('table.next')}
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <Markup noWrap content={t('table.showingXofXResults', { from: page * limit - limit + 1, to: Math.min(page * limit, total), total })} />
          </p>
        </div>
        <div>
          {/*<Select options={undefined} name={undefined} />*/}
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white" aria-label="Pagination">
            {pages.map((page, index) => (
              <a
                key={page.page ?? (page.isPrevious ? 'previous' : page.isNext ? 'next' : `spacer-${index}`)}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page.page) {
                    setPage(page.page);
                  } else if (page.isPrevious && !page.disabled) {
                    setPage((prevState) => prevState - 1);
                  } else if (page.isNext && !page.disabled) {
                    setPage((prevState) => prevState + 1);
                  }
                }}
                className={clsx('relative inline-flex items-center py-2', {
                  'rounded-l-md': index === 0,
                  'rounded-r-md': index === pages.length - 1,
                  'px-2 text-gray-400': page.isPrevious || page.isNext,
                  'px-4 text-sm font-semibold': !page.isPrevious && !page.isNext,
                  'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600': page.isCurrent,
                  'bg-gray-300 text-gray-600 cursor-not-allowed': page.disabled,
                  'text-gray-700': page.isSpacer,
                  'text-gray-900 hover:bg-gray-50': !page.isCurrent && !page.isSpacer && !page.disabled,
                  'focus:z-20': !page.isSpacer,
                  'ring-1 ring-inset ring-gray-300 focus:outline-offset-0': !page.isCurrent,
                })}
              >
                {page.page}
                {page.isPrevious && (<>
                  <span className="sr-only">{t('table.previous')}</span>
                  <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" aria-hidden="true" />
                </>)}
                {page.isNext && (<>
                  <span className="sr-only">{t('table.next')}</span>
                  <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" aria-hidden="true" />
                </>)}
                {page.isSpacer && '...'}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
