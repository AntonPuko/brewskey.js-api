// @flow
import type { OHandler } from 'odata';

declare module 'brewskey.js-api' {
  /* DAO
  */

  declare type EntityName =
    'accounts' |
    'beverage-availabilities' |
    'beverage-glasses' |
    'beverage-srms' |
    'beverage-styles' |
    'beverages' |
    'devices' |
    'kegs' |
    'locations' |
    'permissions' |
    'pours' |
    'schedule-groups' |
    'schedules' |
    'taps';

  declare type DAOTranslator<TModel, TModelMutator> = {
    +fromApi: (apiValue: Object) => TModel,
    +toApi: (model: TModelMutator) => Object,
    +toForm: (model: TModel) => TModelMutator,
  };

  declare type DAOConfig<TModel, TModelMutator> = {
    entityName: EntityName,
    navigationProperties?: {[string]: ?Array<string>},
    translator: DAOTranslator<TModel, TModelMutator>,
  };

  /* odata
  */

  declare type RequestStatus = {
    FAILURE: string,
    REQUEST: string,
    SUCCESS: string
  };

  declare type RequestMethod =
    'delete' |
    'get' |
    'patch' |
    'post' |
    'put';

  declare type FilterOperator =
    'contains' |
    'endswith' |
    'eq' |
    'gt' |
    'ge' |
    'lt' |
    'le' |
    'not endswith' |
    'ne' |
    'not startswith' |
    'startswith';

  declare type ConfigType<TModel> = {
    data?: Object,
    method: RequestMethod,
    oHandler: OHandler<TModel>,
  };

  declare type QueryFilter = {
    operator: FilterOperator,
    params: Array<string>,
    values: Array<string>
  };

  declare type QueryOrderBy = {
    column: string,
    direction: 'asc' | 'desc',
  };

  declare type QueryOptions = {
    count?: boolean,
    filters?: Array<QueryFilter>,
    orderBy?: Array<QueryOrderBy>,
    skip?: number,
    take?: number,
  };

  declare type ODataAction<TModel> = {
    meta?: Object,
    method: RequestMethod,
    oHandler: OHandler<TModel>,
    params?: Object,
    queryOptions: QueryOptions,
    type: string,
    types: RequestStatus,
  };

  declare type ResultSet<TModel> = OHandler<TModel> & {
    data: Array<TModel>,
    inlinecount?: number,
  };

  declare type RequestAction = {
    method: RequestMethod,
    type: string,
  };

  declare type SuccessAction<TModel> = {
    method: RequestMethod,
    params?: Object,
    queryOptions: QueryOptions,
    result: ResultSet<TModel>,
    type: string,
  };

  declare type FailureAction = {
    error: Error,
    method: RequestMethod,
    params?: Object,
    queryOptions: QueryOptions,
    type: string,
  };

  declare type ODataChartParams = {
    beginDate?: ?Date,
    endDate?: ?Date,
  };

  /* Entities
  */

  declare type Account = {
    accessFailedCount: number,
    banned: boolean,
    createdDate: string,
    email: string,
    emailConfirmed: boolean,
    fullName: ?string,
    id: string,
    lockoutEnabled: boolean,
    lockoutEndDateUtc: ?string,
    logins: Object,
    phoneNumber: ?number,
    phoneNumberConfirmed: boolean,
    roles: Object,
    twoFactorEnabled: boolean,
    userName: string,
  };

  declare type Availability = {
    description: ?string,
    id: string,
    name: string,
  };

  declare type BeverageType =
    'Beer' |
    'Cider' |
    'Coffee' |
    'Soda';

  declare type ServingTemperature =
    'cellar' |
    'cold' |
    'cool' |
    'hot' |
    'very_cold' |
    'warm';

  declare type Beverage = {
    abv: number,
    availableId: ?string,
    beerVariationId: ?string,
    beverageType: BeverageType,
    createDate: Date,
    createdBy: {
      id: string,
      userName: string,
    },
    description: ?string,
    externalId: ?string,
    foodPairings: ?string,
    glasswareId: ?number,
    ibu: number,
    id: string,
    isOrganic: ?string,
    labels: {
      icon: string,
      large: string,
      medium: string,
    },
    name: string,
    originalGravity: ?number,
    servingTemperature: ?ServingTemperature,
    servingTemperatureDisplay: ?string,
    srmId: ?string,
    styleId: ?string,
    updateDate: Date,
    year: ?number,
  };

  declare type Device = {
    createdBy: {
      id: string,
      userName: string,
    },
    deviceStatus: string,
    id: number,
    isDeleted: boolean,
    isMultiTap: boolean,
    lastEdited: string,
    lastEditedBy: {
      id: string,
      userName: string,
    },
    name: string,
    particleId: string,
    temperature: number,
  };

  declare type Glass = {
    createDate: Date,
    description: ?string,
    id: string,
    name: string,
    updateDate: Date,
  };

  declare type Keg = {
    beerIcon: string,
    beerId: string,
    beerName: string,
    floatedDate: string,
    id: number,
    kegType: string,
    location: {
      id: number,
      name: string,
    },
    maxOunces: number,
    ounces: number,
    pulses: number,
    tap: {
      id: number,
      name: string,
    },
    tapDate: string,
  };

  declare type Location = {
    city: string,
    createdDate: string,
    description: string,
    geolocation: Object,
    id: number,
    locationType: string,
    name: string,
    state: ?string,
    street: string,
    suite: string,
    summary: string,
    timeZone: string,
    zipCode: number,
  };

  declare type PermissionEntityType =
    'devices' |
    'locations' |
    'taps';

  declare type PermissionType =
    'Administrator'|
    'Edit'|
    'Read'|
    'BannedFromTap';

  declare type Permission = {
    createdBy: {
      id: string,
      userName: string,
    },
    createdDate: Date,
    device: ?{
      id: string,
      name: string,
    },
    expiresDate: ?Date,
    forUser: {
      id: string,
      userName: string,
    },
    id: string,
    invalid: boolean,
    location: ?{
      id: string,
      name: string,
    },
    permissionType: PermissionType,
    startDate: ?Date,
    tap: ?{
      id: string,
      name: string,
    },
  };

  declare type PermissionMutator = {
    entityId: string,
    entityType: PermissionEntityType,
    expiresDate: ?Date,
    id: ?string,
    permissionType: PermissionType,
    startDate: ?Date,
    userId: string,
  };

  declare type Pour = {
    beverage: {
      id: number,
      name: string,
    },
    id: number,
    location: {
      id: number,
      name: string,
    },
    ounces: number,
    owner: {
      id: string,
      userName: string,
    },
    pourDate: string,
    pulses: number,
    tap: {
      id: number,
      name: string,
    },
  };

  declare type Schedule = {
    accounts: Array<{
      id: string,
      name: string,
    }>,
    createdDate: Date,
    days: number,
    editDate: Date,
    endTime: Date,
    id: string,
    location: {
      id: string,
      name: string,
    },
    name: string,
    startTime: Date,
  };

  declare type ScheduleMutator = {
    accounts: Array<{
      id: string,
      name: string,
    }>,
    days: number,
    endTime: Date,
    id: ?string,
    locationId: ?string,
    name: string,
    startTime: Date,
  };

  declare type Srm = {
    hex: string,
    id: string,
    name: string,
  };

  declare type Style = {
    abvMax: number,
    abvMin: number,
    createDate: Date,
    description: ?string,
    fgMax: number,
    fgMin: number,
    ibuMax: number,
    ibuMin: number,
    id: string,
    name: string,
    ogMax: number,
    ogMin: number,
    srmMax: number,
    srmMin: number,
    updateDate: Date,
  };

  declare type Tap = {
    createdDate: string,
    description: ?string,
    device: {
      id: string,
      name: string,
    },
    disableBadges: boolean,
    hideLeaderboard: boolean,
    hideStats: boolean,
    id: string,
    location: {
      id: string,
      name: string,
    },
    name: string,
    requiresPourPrivilege: boolean,
  };

  declare type TapMutator = {
    createdDate: ?string,
    description: ?string,
    deviceId: string,
    disableBadges: boolean,
    hideLeaderboard: boolean,
    hideStats: boolean,
    id: ?string,
    locationId: string,
    name: string,
    requiresPourPrivilege: boolean,
  };
}