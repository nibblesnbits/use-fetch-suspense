import React from 'react';
import { createFetchError } from './util';
import { Prefetch, PrefetchState, PrefetchContext } from '../PrefetchContext';
const { useState, useEffect, useContext } = React;

/**
 * Retrieve the data from a previously initiated Prefetch.
 * If the fetch is not already complete, Suspend until completed.
 * @param prefetch Previously initiated Prefetch
 */
export function usePrefetch<T>(prefetch: Prefetch) {
  const [state, setState] = useState<PrefetchState<T>>({
    loading: false,
  });
  const { storeResponse, isCached, getCache } = useContext(PrefetchContext);

  const { promise, aborter, id } = prefetch;

  useEffect(() => {
    let finished = false;

    const cleanup = () => {
      if (!finished) {
        finished = true;
        aborter.abort();
      }
      setState({ loading: false });
    };

    (async () => {
      setState(s => ({ ...s, loading: true }));

      const onFinish = (error?: any, data?: any) => {
        if (!finished) {
          finished = true;
          setState({ loading: false, error, data });
        }
      };

      if (isCached && isCached(id)) {
        onFinish(null, getCache && getCache(id)?.data);
      }

      try {
        const response = await promise;
        if (response.ok) {
          const body = await response.json();
          storeResponse && storeResponse(id, body);
          onFinish(null, body);
        } else {
          const err = await createFetchError(response);
          throw err;
        }
      } catch (e) {
        onFinish(e);
      }
    })();

    return cleanup;
  }, [aborter, promise, id, getCache, isCached, storeResponse]);

  if (state.loading) {
    throw promise;
  }

  if (state.error) {
    throw state.error;
  }

  return state.data;
}
