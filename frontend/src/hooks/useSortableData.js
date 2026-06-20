import { useState, useMemo } from "react";

export function useSortableData(data, defaultSortKey = null) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [direction, setDirection] = useState("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      const bothNumeric = !isNaN(numA) && !isNaN(numB);

      const result = bothNumeric
        ? numA - numB
        : valA < valB
          ? -1
          : valA > valB
            ? 1
            : 0;
      return direction === "desc" ? -result : result;
    });
  }, [data, sortKey, direction]);

  const toggleSort = (key) => {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  };

  return { sortedData, sortKey, direction, toggleSort };
}
