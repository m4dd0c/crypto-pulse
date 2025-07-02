import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cryptopulse-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const addFavorite = (symbol: string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      updated.add(symbol);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...updated]));
      return updated;
    });
  };

  const removeFavorite = (symbol: string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      updated.delete(symbol);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...updated]));
      return updated;
    });
  };

  const toggleFavorite = (symbol: string) => {
    if (favorites.has(symbol)) {
      removeFavorite(symbol);
    } else {
      addFavorite(symbol);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite: (symbol: string) => favorites.has(symbol),
  };
}