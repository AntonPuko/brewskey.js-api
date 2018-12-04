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
  isAutorefreshToggled: boolean = true;

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
  }

  startAutorefresh = () => {
    if (this.isAutorefreshToggled) {
      return;
    }
    Signalr.TapHub.registerListener('newPour', this._onNewPour);
    this.flushQueryCaches();
    this.isAutorefreshToggled = true;
  };

  stopAutorefresh = () => {
    Signalr.TapHub.unregisterListener('newPour', this._onNewPour);
    this.isAutorefreshToggled = false;
  };

  toggleAutorefresh = () => {
    if (this.isAutorefreshToggled) {
      this.stopAutorefresh();
    } else {
      this.startAutorefresh();
    }
  };

  _onNewPour = (pourId: EntityID) => {
    this.fetchByID(pourId);
    this.flushQueryCaches();
  };
}

export default new PourDAO();
