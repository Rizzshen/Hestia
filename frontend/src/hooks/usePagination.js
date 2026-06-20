import { useState, useMemo } from "react";

export function usePagination(data, pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = useMemo(() => {
    // TODO: calculate startIndex and endIndex, then return data.slice(startIndex, endIndex)
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
}, [data, page, pageSize]);

  const goToPage = (newPage) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  return { paginatedData, page, totalPages, goToPage };
}
