interface PromiseResolverResult<T> {
  resolve?: () => void;
  promise: Promise<T>;
}

export function createPromiseResolver<T>(): PromiseResolverResult<T> {
  let resolve;
  const promise = new Promise<T>(r => {
    resolve = r;
  });
  return { resolve, promise };
}

export const createFetchError = async (response: Response) => {
  const json = await response.json();
  return new Error(json.message);
};
