/** Based off the example custom-instance from Orval docs
 * https://github.com/anymaniax/orval/blob/master/samples/react-app-with-react-query/src/api/mutator/custom-instance.ts
 * TODO: Considering using Fetch-API instead of axios. This instance will have to change. See https://react-query.tanstack.com/guides/query-cancellation
 *       Could be achieved without changing much using `redaxios`
 */

import Axios, { AxiosRequestConfig } from 'axios';

// ? Need the baseUrl or does it default to ''?
export const AXIOS_INSTANCE = Axios.create({ baseURL: '' });

/**
 * Set the access token to be added as the `Authorization: Bearer 'token'` header
 * Useful for client only apps where a proxy API route isn't involved to securely add the access token
 * @param token access token
 */
export const setAuthToken = (token: string) => {
  AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Set the url to which request paths are added to.
 * @param baseUrl origin + subpath e.g. 'https://example.com/subpath' or '/subpath'
 */
export const setBaseUrl = (baseUrl: string) => {
  AXIOS_INSTANCE.defaults.baseURL = baseUrl;
};

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  // Rewrite 'data' of all POST requests to multipart form-data
  // ? Could this be problematic if data needs to be used for both the body and forming the path?
  const method = config.method?.toLowerCase();
  if (method === 'post' || method === 'put') {
    const formData = new FormData();
    for (const key of Object.keys(config.data)) {
      formData.append(key, config.data[key]);
    }

    config.data = formData;
  }

  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(({ data }) => data);

  // Promise doesn't have a cancel method but react-query requires this method to make cancellations general.
  // This can either be a any assertion or a @ts-ignore comment.
  (promise as any).cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};
