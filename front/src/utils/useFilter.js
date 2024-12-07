import { useState, useCallback } from "react";

const useFilter = (initialSortOrder = "low") => {
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const setFilter = useCallback((order) => {
    setSortOrder(order);
  }, []);

  return {
    sortOrder,
    setFilter,
  };
};

export default useFilter;
