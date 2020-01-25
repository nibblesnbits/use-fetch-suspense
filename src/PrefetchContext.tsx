import React, { createContext, useState } from 'react';

export interface PrefetchState<T> {
  data?: T;
  error?: any;
  [propName: string]: any;
}

export interface PrefetchContextValue {
  storeResponse: (id: string, data: any, error?: any) => void;
  isCached: (id: string) => boolean;
  getCache: <T>(id: string) => PrefetchState<T>;
  setLoading: (id: string, loading: boolean) => void;
}

export const PrefetchContext = createContext<Partial<PrefetchContextValue>>({});

/**
 * Create a Prefetch for retrieval later
 * @param id Unique identifier for this prefetch
 * @param url Full URL to API endpoint
 * @param config Optional RequestInit for fetch call
 */
export function createPrefetch(id: string, url: string, config?: RequestInit) {
  const aborter = new AbortController();

  const promise = fetch(url, {
    ...config,
    signal: aborter.signal,
  });
  return {
    aborter,
    promise,
    id,
  };
}

export type Prefetch = ReturnType<typeof createPrefetch>;

export const PrefetchProvider: React.FC = props => {
  const [state, setState] = useState<PrefetchState<any>>({});

  const contextValue = {
    storeResponse(id: string, data: any, error: any) {
      setState(s => ({
        ...s,
        [id]: {
          ...s[id],
          data,
          error,
        },
      }));
    },
    isCached(id: string) {
      return state.hasOwnProperty(id) && !!state[id].data;
    },
    getCache(id: string) {
      return state[id];
    },
    setLoading(id: string, loading: boolean) {
      setState(s => ({
        ...s,
        [id]: {
          ...s[id],
          loading,
        },
      }));
    },
  };

  return (
    <PrefetchContext.Provider value={contextValue}>
      {props.children}
    </PrefetchContext.Provider>
  );
};
