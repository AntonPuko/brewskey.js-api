// @flow

import type { EntityID } from '../types';

import RestDAO from './RestDAO';

export type ProductDevice = {
  denied: boolean,
  desiredFirmwareVersion: ?number,
  development: boolean,
  functions: Array<Object>,
  id: EntityID,
  lastHeard: Date,
  lastIpAddress: string,
  name: string,
  notes: string,
  platformId: string,
  productId: string,
  quarantined: boolean,
  status: string,
  variables: Object,
};

export type ProductDeviceMutator = {
  denied?: boolean,
  desiredFirmwareVersion?: ?number,
  development?: boolean,
  notes?: ?string,
  quarantined?: boolean,
};

class ProductDeviceDAO extends RestDAO<ProductDevice, ProductDeviceMutator> {
  count(productIdOrSlug: string) {
    return this.__count(`products/${productIdOrSlug}/devices/count`);
  }

  getMany(productIdOrSlug: string) {
    return this.__getMany(`products/${productIdOrSlug}/devices/`);
  }

  getOne(productIdOrSlug: string, particleId: string) {
    return this.__getOne(
      `products/${productIdOrSlug}/devices/${particleId}/`,
      particleId,
    );
  }

  post(productIdOrSlug: string, deviceMutator: any) {
    return this.__post(`products/${productIdOrSlug}/devices/`, deviceMutator);
  }

  put(productIdOrSlug: string, particleId: string, deviceMutator: any) {
    return this.__put(
      `products/${productIdOrSlug}/devices/${particleId}/`,
      particleId,
      deviceMutator,
    );
  }

  delete(productIdOrSlug: string, particleId: string) {
    return this.__delete(
      `products/${productIdOrSlug}/devices/${particleId}`,
      particleId,
    );
  }
}

export default ProductDeviceDAO;
