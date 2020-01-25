# use-fetch-suspense

> Use [Suspense for Data Fetching](https://reactjs.org/docs/concurrent-mode-suspense.html) early!

[![NPM](https://img.shields.io/npm/v/use-fetch-suspense.svg)](https://www.npmjs.com/package/use-fetch-suspense) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm i -S use-fetch-suspense
```

## Usage

```jsx
import React, { Suspense } from "react";
import { FetchProvider, useFetch } from "use-fetch-suspense";

const Fetcher = () => {
  const data = useFetch("breeds/image/random");
  return data ? <img alt="dog" src={data.message} /> : null;
};

export default () => {
  return (
    <FetchProvider
      config={{
        baseUri: "https://dog.ceo/api/"
      }}
    >
      <Suspense fallback="Loading...">
        <Fetcher />
      </Suspense>
    </FetchProvider>
  );
};
```

## License

MIT © [nibblesnbits](https://github.com/nibblesnbits)
