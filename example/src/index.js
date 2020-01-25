import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { FetchProvider, useFetch } from 'use-fetch';

const Fetcher = () => {
  const data = useFetch('breeds/image/random');
  return data ? <img alt="dog" src={data.message} /> : null;
};

const App = () => {
  return (
    <FetchProvider
      config={{
        baseUri: 'https://dog.ceo/api/',
      }}
    >
      <Suspense fallback="Loading...">
        <Fetcher />
      </Suspense>
    </FetchProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
