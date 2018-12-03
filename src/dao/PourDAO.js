// @flow

import type { EntityID, ShortenedEntity } from '../types';
import type { ShortenedTap } from './TapDAO';

import ODataDAO from './ODataDAO';
import { DAO_ENTITIES } from '../constants';
import PourTranslator from '../translators/PourTranslator';
import Signalr from '../signalr';

export type Pour = {
  beverage: ?ShortenedEntity,
  id: EntityID,
  isDeleted: boolean,
  keg: { id: EntityID },
  location: ?ShortenedEntity,
  organization: ShortenedEntity,
  ounces: number,
  owner: { id: EntityID, userName: string },
  pourDate: string,
  pulses: number,
  tap: ?ShortenedTap,
};

class PourDAO extends ODataDAO<Pour, Pour> {
  constructor() {
    super({
      entityName: DAO_ENTITIES.POURS,
      navigationProperties: {
        beverage: { select: ['id', 'isDeleted', 'name'] },
        keg: { select: ['id'] },
        location: { select: ['id', 'isDeleted', 'name'] },
        organization: { select: ['id', 'isDeleted', 'name'] },
        owner: { select: ['id', 'userName'] },
        tap: { select: ['id', 'isDeleted'] },
      },
      translator: new PourTranslator(),
    });

    Signalr.TapHub.registerListener('newPour', this._onNewPour);
  }

  _onNewPour = ({ id }) => {
    this.fetchByID(id);
    this.flushQueryCaches();
  };
}

export default new PourDAO();
