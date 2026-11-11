import { useState, useEffect, useCallback } from 'react';

export interface SavedSnapshot {
  id: string;
  name: string;
  description?: string;
  html: string;
  createdAt: string; // ISO string
  updatedAt?: string;
  tags?: string[];
  modelBadge?: string;
  lineCount: number;
  sizeKb: string;
}

const STORAGE_KEY = 'omnihtml_saved_snapshots_v1';

export function useSavedSnapshots() {
  const [snapshots, setSnapshots] = useState<SavedSnapshot[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load saved snapshots from localStorage:', err);
    }
    return [];
  });

  // Save to localStorage whenever snapshots change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
    } catch (err) {
      console.error('Failed to persist snapshots to localStorage:', err);
    }
  }, [snapshots]);

  // Create & save a new snapshot
  const saveSnapshot = useCallback((
    html: string,
    name: string,
    options?: {
      description?: string;
      tags?: string[];
      modelBadge?: string;
    }
  ): SavedSnapshot => {
    const trimmedName = name.trim() || `Snapshot ${new Date().toLocaleDateString()}`;
    const newSnapshot: SavedSnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      description: options?.description?.trim(),
      html,
      createdAt: new Date().toISOString(),
      tags: options?.tags || [],
      modelBadge: options?.modelBadge,
      lineCount: html.split('\n').length,
      sizeKb: (new Blob([html]).size / 1024).toFixed(1),
    };

    setSnapshots((prev) => [newSnapshot, ...prev]);
    return newSnapshot;
  }, []);

  // Update existing snapshot metadata or overwrite content
  const updateSnapshot = useCallback((
    id: string,
    updates: Partial<Omit<SavedSnapshot, 'id' | 'createdAt'>>
  ) => {
    setSnapshots((prev) =>
      prev.map((snap) =>
        snap.id === id
          ? {
              ...snap,
              ...updates,
              updatedAt: new Date().toISOString(),
              ...(updates.html
                ? {
                    lineCount: updates.html.split('\n').length,
                    sizeKb: (new Blob([updates.html]).size / 1024).toFixed(1),
                  }
                : {}),
            }
          : snap
      )
    );
  }, []);

  // Delete a snapshot
  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Clear all saved snapshots (with optional confirmation handled by caller)
  const clearAllSnapshots = useCallback(() => {
    setSnapshots([]);
  }, []);

  return {
    snapshots,
    saveSnapshot,
    updateSnapshot,
    deleteSnapshot,
    clearAllSnapshots,
    totalSnapshots: snapshots.length,
  };
}
