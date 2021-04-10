/** Based off the example custom-instance from Orval docs
 * https://github.com/anymaniax/orval/blob/master/samples/react-app-with-react-query/src/api/mutator/custom-instance.ts
 * TODO: Consider using Fetch-API instead of axios. This instance will have to change. See https://react-query.tanstack.com/guides/query-cancellation
 *       Could be achieved without changing much using `redaxios`
 */

import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: '' });

export const setAuthToken = (token: string) => {
  AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const setBaseUrl = (baseUrl: string) => {
  AXIOS_INSTANCE.defaults.baseURL = baseUrl;
};

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  console.debug(config);

  const token = AXIOS_INSTANCE.defaults.headers.common['Authorization'] as unknown;
  if (!token) {
    throw Error('Please specify an auth-token (use `setAuthToken`) before making a request!');
  }

  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(({ data }) => data);

  // Promise doesn't have a cancel method but react-query requires this method to make cancellations general.
  // This can either be a any assertion or a @ts-ignore comment.
  (promise as any).cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};
