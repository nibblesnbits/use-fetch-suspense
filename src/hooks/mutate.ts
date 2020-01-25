import React from 'react';
import { createFetchError } from './util';
import FetchContext from '../FetchContext';
const { useState, useCallback, useContext } = React;

interface FetchState<T> {
  loading: boolean;
  data?: T;
  error?: any;
}

type MutateMethod = 'POST' | 'PUT';

/**
 * Result returned from a `useMutate()` call
 */
type MutateHookResult<TBody, TResult> = [
  /**
   * The function that calls the API endpoint
   */
  (body: TBody) => Promise<TResult>,
  /**
   * `true` if the API call is waiting for a response
   */
  boolean
];

/**
 * Returns a tuple containing a `mutate()` call to perform an API call with
 * the provided body, as well as a `pending` flag that is `true` while
 * the API call is waiting for a response.
 *
 * @param path Path to the API endpoint called with the `mutate()` returned
 * @param method HTTP method for the call
 * @param config Optional additional configuration for the `fetch()` call
 */
export function useMutate<TBody, TResult>(
  path: string,
  method: MutateMethod,
  config?: RequestInit
): MutateHookResult<TBody, TResult> {
  const { baseUri } = useContext(FetchContext);
  const [state, setState] = useState<FetchState<TBody>>({
    loading: false,
  });

  const mutate = useCallback(
    async body => {
      setState({
        loading: true,
      });
      const url = baseUri ? new URL(path, baseUri).href : path;
      const response = await fetch(url, {
        ...config,
        method,
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const json = await response.json();
        setState({
          data: json,
          loading: false,
        });
        return json;
      }
      const err = await createFetchError(response);
      setState({
        loading: false,
        error: err,
      });
      throw err;
    },
    [path, method, config, baseUri]
  );

  return [mutate, state.loading];
}
