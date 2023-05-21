export function executePromisesSequentially<T>(promises: (() => Promise<T>)[]): Promise<T[]> {
  return promises.reduce(
    // eslint-disable-next-line prettier/prettier, max-len
    (previousPromise, currentPromise) => previousPromise.then((promisesResults) => currentPromise().then((result) => [...promisesResults, result]).catch(() => promisesResults)),
    Promise.resolve([] as T[]),
  );
}
