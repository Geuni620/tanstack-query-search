import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchCondition = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(
    searchParams.get('search') || '',
  );

  const onSearchChange = (newValue: string) => {
    setLocalSearch(newValue);
  };

  const onSearchSubmit = () => {
    setSearchParams((prev) => {
      if (localSearch) {
        prev.set('search', localSearch);
      } else {
        prev.delete('search');
      }

      prev.set('page', '1');
      return prev;
    });
  };

  return {
    search: localSearch,
    onSearchChange,
    onSearchSubmit,
  };
};
