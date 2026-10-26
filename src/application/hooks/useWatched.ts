import { useContext } from 'react';
import {
  WatchedContext,
  WatchedContextData,
} from '../contexts/WatchedContext';

export function useWatched(): WatchedContextData {
  const context = useContext(WatchedContext);

  if (!context) {
    throw new Error('useWatched must be used within a WatchedProvider');
  }

  return context;
}
