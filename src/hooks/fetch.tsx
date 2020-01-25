import React from 'react';
import { createFetchError, createPromiseResolver } from './util';
import FetchContext from '../FetchContext';
const { useState, useEffect, useMemo, useContext } = React;

interface FetchState<T> {
  loading: boolean;
  data?: T;
  error?: any;
}

/**
 * Make a fetch() GET call to the provided URL
 * @param {string} path Relative path to the API endpoint
 * @param {RequestInit} config Additional fetch configuration options not set in the FetchProvider
 * @returns Returns null until the data has been fetched.  **This hook triggers a React.Supsense**
 * @example
 * // This pattern is typical:
 *
 * const Fetcher = (props) => {
 *   const data = useFetch('/some/url/path');
 *   return data ? <RenderTheData data={data} {...props} /> : null;
 * };
 *
 * const Component = props => {
 *   return (
 *     <Suspense fallback={"Loading data..."}>
 *       <Fetcher {...props} />
 *     </Suspense>
 *   );
 * };
 */
export function useFetch<T>(path: string, config?: RequestInit) {
  const { baseUri } = useContext(FetchContext);
  const [state, setState] = useState<FetchState<T>>({
    loading: false,
  });

  // eslint-disable-next-line
  const promiseResolver = useMemo(() => createPromiseResolver<T>(), [path]);

  useEffect(() => {
    let finished = false;
    const aborter = new AbortController();
    (async () => {
      setState(s => ({ ...s, loading: true }));
      const onFinish = (error?: any, data?: T) => {
        if (!finished) {
          finished = true;
          setState({ loading: false, error, data });
        }
      };
      try {
        const url = baseUri ? new URL(path, baseUri).href : path;
        const response = await fetch(url, {
          ...config,
          signal: aborter.signal,
        });
        if (response.ok) {
          const body = await response.json();
          onFinish(null, body);
        } else {
          const err = await createFetchError(response);
          throw err;
        }
      } catch (e) {
        onFinish(e);
      }

      if (promiseResolver.resolve) {
        promiseResolver.resolve();
      }
    })();
    const cleanup = () => {
      if (!finished) {
        finished = true;
        aborter.abort();
      }
      setState({ loading: false });
    };
    return cleanup;
  }, [path, promiseResolver, config, baseUri]);

  if (state.loading) {
    throw promiseResolver.promise;
  }

  if (state.error) {
    throw state.error;
  }

  return state.data;
}
