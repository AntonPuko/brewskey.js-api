// @flow
import type {
  EntityID,
  Report,
  ReportMutator,
  ShortenedEntity,
} from '../index';

import DefaultTranslator from './DefaultTranslator';

export const CADENCE_MAP = {
  Biweekly: 3,
  Daily: 1,
  Monthly: 4,
  OneTime: 0,
  Weekly: 2,
};

class ReportTranslator extends DefaultTranslator<Report, ReportMutator> {
  toApi({
    devices,
    locations,
    sendToEmails,
    taps,
    ...props
  }: ReportMutator): Object {
    return {
      ...props,
      deviceIds: devices
        ? devices.map(({ id }: ShortenedEntity): EntityID => id)
        : [],
      locationIds: locations
        ? locations.map(({ id }: ShortenedEntity): EntityID => id)
        : [],
      sendToEmails: sendToEmails.map(
        ({ email }: { email: string }): string => email,
      ),
      tapIds: taps ? taps.map(({ id }: ShortenedEntity): EntityID => id) : [],
    };
  }

  toForm(report: Report): Object {
    return {
      ...report,
      reportCadence: CADENCE_MAP[report.reportCadence],
      sendToEmails: report.sendToEmails.map((email: string): Object => ({
        email,
      })),
    };
  }
}

export default ReportTranslator;
