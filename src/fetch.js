// @flow

import type { Header } from './index';

import oHandler from 'odata';

export default async (path: string, options: ?Object): Promise<*> => {
  const { endpoint, headers: oheaders = [] } = oHandler().oConfig;

  if (!endpoint) {
    throw new Error('no-ohandler-endpoint');
  }

  const headers = new Headers();
  oheaders.forEach(({ name, value }: Header): void =>
    headers.append(name, value),
  );

  ((options && options.headers) || []).forEach(
    ({ name, value }: Header): void => headers.append(name, value),
  );

  const response = await fetch(`${endpoint}/${path}`, { ...options, headers });

  let responseJson;
  try {
    responseJson = await response.json();
  } catch (error) {
    responseJson = null;
  }

  if (!response.ok) {
    throw new Error(
      (responseJson.error && responseJson.error.message) || 'Whoops! Error!',
    );
  }

  return responseJson;
};
