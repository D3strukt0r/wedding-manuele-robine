import { useMemo, useState } from 'react';

export default function usePagination() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [limit, page]);

  return { limit, setLimit, page, setPage, offset };
}
