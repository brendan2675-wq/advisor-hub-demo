import { useState, useCallback, useEffect, useRef } from 'react';

export function useLoadingState(delay = 800) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const triggerLoading = useCallback(() => {
    setIsLoading(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsLoading(false), delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isLoading, triggerLoading, setIsLoading };
}

export function useClientChangeLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const prevClientRef = useRef<string>('');

  const checkClientChange = useCallback((clientId: string) => {
    if (prevClientRef.current && prevClientRef.current !== clientId) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    }
    prevClientRef.current = clientId;
  }, []);

  return { isLoading, checkClientChange };
}
