import { useState, useCallback, useRef, useEffect } from 'react';

export type HistorySource = 'initial' | 'template' | 'ai_generation' | 'editor' | 'auto_fix';

export interface HistoryEntry {
  id: string;
  html: string;
  timestamp: Date;
  source: HistorySource;
  label: string;
  lineCount: number;
  sizeKb: string;
}

const MAX_HISTORY = 5;

export function useHtmlHistory(initialHtml: string, initialLabel: string = 'Initial Template') {
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    {
      id: `hist-${Date.now()}-0`,
      html: initialHtml,
      timestamp: new Date(),
      source: 'initial',
      label: initialLabel,
      lineCount: initialHtml.split('\n').length,
      sizeKb: (new Blob([initialHtml]).size / 1024).toFixed(1),
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [liveHtml, setLiveHtml] = useState<string>(initialHtml);

  // Debounce ref for live editor typing
  const editorDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize liveHtml whenever history index changes (undo / redo / revert)
  useEffect(() => {
    if (history[currentIndex]) {
      setLiveHtml(history[currentIndex].html);
    }
  }, [currentIndex, history]);

  // Push an explicit new snapshot (e.g. AI generation, template loaded, auto-fix)
  const pushHistory = useCallback((
    newHtml: string,
    source: HistorySource,
    label?: string
  ) => {
    if (!newHtml || typeof newHtml !== 'string') return;

    if (editorDebounceRef.current) {
      clearTimeout(editorDebounceRef.current);
    }

    setLiveHtml(newHtml);

    setHistory((prevHistory) => {
      const activeEntry = prevHistory[currentIndex];
      if (activeEntry && activeEntry.html === newHtml) {
        return prevHistory;
      }

      // Truncate any redo branch
      const historyUpToCurrent = prevHistory.slice(0, currentIndex + 1);

      const defaultLabel = {
        initial: 'Initial Template',
        template: 'Loaded Template',
        ai_generation: 'AI Generation',
        editor: 'Manual Code Edit',
        auto_fix: 'Responsive Auto-Fix',
      }[source];

      const newEntry: HistoryEntry = {
        id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        html: newHtml,
        timestamp: new Date(),
        source,
        label: label || defaultLabel,
        lineCount: newHtml.split('\n').length,
        sizeKb: (new Blob([newHtml]).size / 1024).toFixed(1),
      };

      const updated = [...historyUpToCurrent, newEntry];

      // Keep strictly the last 5 versions
      if (updated.length > MAX_HISTORY) {
        const sliced = updated.slice(-MAX_HISTORY);
        setCurrentIndex(sliced.length - 1);
        return sliced;
      }

      setCurrentIndex(updated.length - 1);
      return updated;
    });
  }, [currentIndex]);

  // Live update for interactive typing in CodeEditor with auto-debounced snapshot
  const updateHtml = useCallback((newHtml: string, label: string = 'Manual Code Edit') => {
    setLiveHtml(newHtml);

    if (editorDebounceRef.current) {
      clearTimeout(editorDebounceRef.current);
    }

    editorDebounceRef.current = setTimeout(() => {
      setHistory((prevHistory) => {
        const activeEntry = prevHistory[currentIndex];
        if (activeEntry && activeEntry.html === newHtml) {
          return prevHistory;
        }

        const historyUpToCurrent = prevHistory.slice(0, currentIndex + 1);
        const newEntry: HistoryEntry = {
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          html: newHtml,
          timestamp: new Date(),
          source: 'editor',
          label,
          lineCount: newHtml.split('\n').length,
          sizeKb: (new Blob([newHtml]).size / 1024).toFixed(1),
        };

        const updated = [...historyUpToCurrent, newEntry];
        if (updated.length > MAX_HISTORY) {
          const sliced = updated.slice(-MAX_HISTORY);
          setCurrentIndex(sliced.length - 1);
          return sliced;
        }

        setCurrentIndex(updated.length - 1);
        return updated;
      });
    }, 600);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (editorDebounceRef.current) {
      clearTimeout(editorDebounceRef.current);
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => {
        const targetIndex = prev - 1;
        if (history[targetIndex]) {
          setLiveHtml(history[targetIndex].html);
        }
        return targetIndex;
      });
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (editorDebounceRef.current) {
      clearTimeout(editorDebounceRef.current);
    }
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => {
        const targetIndex = prev + 1;
        if (history[targetIndex]) {
          setLiveHtml(history[targetIndex].html);
        }
        return targetIndex;
      });
    }
  }, [currentIndex, history]);

  const revertToIndex = useCallback((index: number) => {
    if (editorDebounceRef.current) {
      clearTimeout(editorDebounceRef.current);
    }
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      setLiveHtml(history[index].html);
    }
  }, [history]);

  // Global Keyboard Shortcuts (Ctrl+Z for Undo, Ctrl+Y or Cmd+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused on an input other than the code textarea, let normal input undo happen
      const activeElement = document.activeElement;
      const isInputOrTextarea = activeElement?.tagName === 'INPUT';

      if (isInputOrTextarea) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (
        (modifier && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (modifier && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    currentHtml: liveHtml,
    history,
    currentIndex,
    canUndo,
    canRedo,
    undo,
    redo,
    pushHistory,
    updateHtml,
    revertToIndex,
    maxHistory: MAX_HISTORY,
  };
}
