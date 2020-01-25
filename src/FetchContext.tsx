import React from 'react';
const { createContext } = React;

const FetchContext = createContext<Partial<FetchConfig>>({});
/**
 * Basic configuration for all `fetch()` calls performed
 * via the `useFetch()` and `useMutate()` hooks
 */
export interface FetchConfig {
  baseUri: string;
}

interface FetchProviderProps {
  config: FetchConfig;
}

/**
 * Provides facilities for storing `fetch()` call configuration
 */
export const FetchProvider: React.FC<FetchProviderProps> = ({
  config,
  ...props
}) => {
  return (
    <FetchContext.Provider value={config}>
      {props.children}
    </FetchContext.Provider>
  );
};

export default FetchContext;
