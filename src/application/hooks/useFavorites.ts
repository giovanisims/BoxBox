import { useContext } from 'react';
import {
  FavoritesContext,
  FavoritesContextData,
} from '../contexts/FavoritesContext';

export function useFavorites(): FavoritesContextData {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  return context;
}
