import { useCallback, useState } from 'react';
import { IDriverRepository } from '../../domain/contracts/IDriverRepository';
import { Driver } from '../../domain/entities/Driver';
import { JolpicaDriverRepository } from '../../infrastructure/api/JolpicaDriverRepository';

const driverRepository: IDriverRepository = new JolpicaDriverRepository();

export function useDriverSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Driver[]>([]);
  const [searching, setSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const executeSearch = useCallback(async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setIsSearchOpen(false);
      setSearchResults([]);
      return;
    }

    setIsSearchOpen(true);
    setSearching(true);

    try {
      const results = await driverRepository.searchDrivers(trimmed);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    isSearchOpen,
    executeSearch,
    clearSearch,
  };
}
