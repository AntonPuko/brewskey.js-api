// @flow

import type { EntityID, Headers, OConfig } from './index';

import oHandler from 'odata';
import { DAO_ENTITIES, PERMISSIONS_MAP } from './constants';
import BaseDAO from './dao/DAO';
import { CADENCE_MAP } from './translators/ReportTranslator';
import LoadObject from './LoadObject';

import fetch from './fetch';
import { createFilter, doesSatisfyQueryFilters } from './filters';

import AccountDAO from './dao/AccountDAO';
import AvailabilityDAO from './dao/AvailabilityDAO';
import BeverageDAO from './dao/BeverageDAO';
import DeviceDAO from './dao/DeviceDAO';
import GlassDAO from './dao/GlassDAO';
import KegDAO from './dao/KegDAO';
import LocationDAO from './dao/LocationDAO';
import OrganizationDAO from './dao/OrganizationDAO';
import PermissionDAO from './dao/PermissionDAO';
import FlowSensorDAO from './dao/FlowSensorDAO';
import PourChartDAO from './dao/PourChartDAO';
import PourDAO from './dao/PourDAO';
import ReportDAO from './dao/ReportDAO';
import ScheduleDAO from './dao/ScheduleDAO';
import SrmDAO from './dao/SrmDAO';
import StyleDAO from './dao/StyleDAO';
import TapDAO from './dao/TapDAO';

const initializeDAOApi = ({ endpoint, headers }: OConfig) => {
  oHandler().config({
    endpoint,
    headers: [
      { name: 'Prefer', value: 'return=representation' },
      ...(headers || []),
    ],
  });
};

const getHeaders = (): Headers => oHandler().oConfig.headers || [];

const setHeaders = (headers: Headers) => {
  oHandler().config({
    headers,
  });
};

const setOrganizationID = (organizationID: ?EntityID) => {
  BaseDAO.setOrganizationID(organizationID);

  AccountDAO.flushCache();
  BeverageDAO.flushCache();
  DeviceDAO.flushCache();
  KegDAO.flushCache();
  LocationDAO.flushCache();
  PermissionDAO.flushCache();
  PourDAO.flushCache();
  ReportDAO.flushCache();
  ScheduleDAO.flushCache();
  TapDAO.flushCache();
};

export { LoadObject, PERMISSIONS_MAP, DAO_ENTITIES, CADENCE_MAP };

/* eslint-disable sorting/sort-object-props */
export default {
  AccountDAO,
  AvailabilityDAO,
  BeverageDAO,
  DeviceDAO,
  FlowSensorDAO,
  GlassDAO,
  KegDAO,
  LocationDAO,
  OrganizationDAO,
  PermissionDAO,
  PourChartDAO,
  PourDAO,
  ReportDAO,
  ScheduleDAO,
  SrmDAO,
  StyleDAO,
  TapDAO,
  createFilter,
  doesSatisfyQueryFilters,
  fetch,
  getHeaders,
  initializeDAOApi,
  setHeaders,
  setOrganizationID,
};
