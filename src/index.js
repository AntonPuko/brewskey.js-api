// @flow

// eslint-disable-next-line import/no-self-import
import type { EntityID, Headers, OConfig } from './index';

import oHandler from 'odata';
import { DAO_ENTITIES, PERMISSIONS_MAP } from './constants';
import BaseODataDAO from './dao/BaseODataDAO';
import { CADENCE_MAP } from './translators/ReportTranslator';
import { MAX_OUNCES_BY_KEG_TYPE } from './dao/KegDAO';
import { FRIEND_STATUSES } from './dao/FriendDAO';
import LoadObject from './LoadObject';
import Subscription from './dao/Subcription';

import fetch from './fetch';
import { createFilter, doesSatisfyQueryFilters } from './filters';

import AccountDAO from './dao/AccountDAO';
import AchievementDAO from './dao/AchievementDAO';
import AvailabilityDAO from './dao/AvailabilityDAO';
import BeverageDAO from './dao/BeverageDAO';
import ClouDeviceDAO from './dao/CloudDeviceDAO';
import DeviceDAO from './dao/DeviceDAO';
import FlowSensorDAO from './dao/FlowSensorDAO';
import FriendDAO from './dao/FriendDAO';
import GlassDAO from './dao/GlassDAO';
import KegDAO from './dao/KegDAO';
import LocationDAO from './dao/LocationDAO';
import OrganizationDAO from './dao/OrganizationDAO';
import PermissionDAO from './dao/PermissionDAO';
import PourChartDAO from './dao/PourChartDAO';
import PourDAO from './dao/PourDAO';
import ProductDAO from './dao/ProductDAO';
import ProductDeviceDAO from './dao/ProductDeviceDAO';
import ProductFirmwareDAO from './dao/ProductFirmwareDAO';
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

const DAOArray = [
  AccountDAO,
  AchievementDAO,
  AvailabilityDAO,
  BeverageDAO,
  DeviceDAO,
  FlowSensorDAO,
  FriendDAO,
  GlassDAO,
  KegDAO,
  LocationDAO,
  OrganizationDAO,
  PermissionDAO,
  PourDAO,
  ReportDAO,
  ScheduleDAO,
  SrmDAO,
  StyleDAO,
  TapDAO,
];

const flushCache = () => {
  DAOArray.forEach((dao: *) => {
    dao.flushCache();
    dao.flushCustomCache();
  });
};

const setOrganizationID = (organizationID: ?EntityID) => {
  BaseODataDAO.setOrganizationID(organizationID);

  AccountDAO.flushCache();
  AchievementDAO.flushCache();
  BeverageDAO.flushCache();
  DeviceDAO.flushCache();
  FriendDAO.flushCache();
  KegDAO.flushCache();
  LocationDAO.flushCache();
  PermissionDAO.flushCache();
  PourDAO.flushCache();
  ReportDAO.flushCache();
  ScheduleDAO.flushCache();
  TapDAO.flushCache();
};

export {
  CADENCE_MAP,
  DAO_ENTITIES,
  FRIEND_STATUSES,
  LoadObject,
  MAX_OUNCES_BY_KEG_TYPE,
  PERMISSIONS_MAP,
};

/* eslint-disable sorting/sort-object-props */
export default {
  AccountDAO,
  AchievementDAO,
  AvailabilityDAO,
  BeverageDAO,
  ClouDeviceDAO,
  DeviceDAO,
  FlowSensorDAO,
  FriendDAO,
  GlassDAO,
  KegDAO,
  LocationDAO,
  OrganizationDAO,
  PermissionDAO,
  PourChartDAO,
  PourDAO,
  ProductFirmwareDAO,
  ProductDAO,
  ProductDeviceDAO,
  ReportDAO,
  ScheduleDAO,
  SrmDAO,
  StyleDAO,
  TapDAO,
  createFilter,
  doesSatisfyQueryFilters,
  fetch,
  flushCache,
  getHeaders,
  initializeDAOApi,
  onError: Subscription.onError,
  setHeaders,
  setOrganizationID,
};
