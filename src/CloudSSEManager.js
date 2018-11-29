// @flow

import oHandler from 'odata';
import { EventSourcePolyfill } from 'event-source-polyfill';
import Subscription from './dao/Subscription';

export type SSESubscriptionOptions = {|
  eventNamePrefix?: string,
  onError?: (error: Error) => any,
  onOpen?: () => any,
  particleId?: string,
|};

export type CloudEvent = {|
  data: any,
  name: string,
  particleId: string,
  publishedAt: Date,
|};

type SSEHandler = (event: CloudEvent) => any;

class CloudSSEManager extends Subscription {
  static _sessionByHandler: Map<SSEHandler, EventSourcePolyfill> = new Map();

  static subscribe(
    handler: SSEHandler,
    subscribeOptions: SSESubscriptionOptions,
  ) {
    const { onError, onOpen } = subscribeOptions;

    const session = new EventSourcePolyfill(
      CloudSSEManager._getUrl(subscribeOptions),
      {
        headers: CloudSSEManager._getHeaders(),
      },
    );

    session.addEventListener('message', sseEvent => {
      try {
        const cloudEventStr = sseEvent.data;
        const cloudEvent = JSON.parse(cloudEventStr);

        const {
          name,
          coreid: particleId,
          data,
          published_at: publishedAt,
        } = cloudEvent;

        handler({ data, name, particleId, publishedAt });
      } catch (error) {
        CloudSSEManager.__emitError(error);
        if (onError) {
          onError(error);
        }
      }
    });

    if (onOpen) {
      session.addEventListener('open', onOpen);
    }

    if (onError) {
      session.addEventListener('error', onError);
    }

    session.addEventListener('error', CloudSSEManager.__emitError);

    CloudSSEManager._sessionByHandler.set(handler, session);
  }

  static unsubscribe(handler: SSEHandler) {
    const session = CloudSSEManager._sessionByHandler.get(handler);
    if (!session) {
      return;
    }
    session.close();
    CloudSSEManager._sessionByHandler.delete(handler);
  }

  static _getUrl({ eventNamePrefix = '', particleId }: SSESubscriptionOptions) {
    const { endpoint }: any = oHandler().oConfig;

    const devicesUrl = particleId ? `devices/${particleId}/events/` : 'events/';

    return `${endpoint}${devicesUrl}${eventNamePrefix}`;
  }

  static _getHeaders() {
    const { headers: oHeaders = [] } = oHandler().oConfig;

    return oHeaders.reduce(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {},
    );
  }
}

export default CloudSSEManager;
