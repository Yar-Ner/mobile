export type User = {
  id: number;
  username: string;
  fullname: string;
  token: string;
};

export type Car = {
  id: number | null;
  name: string | null;
  number: string | null;
  color: string | null;
  weight: number | null;
  type: number | null;
  containers?: Array<ResponseContainerType>;
};

export type Photo = {
  id: string | undefined;
  taskId?: number;
  addressId?: number;
  orderId?: number;
  uri?: string;
  responseId?: number;
};

export type ResponsePhoto = {
  id: number;
  acl_user_id: number;
  uploaded: string;
  url: string;
};

export type AlarmType = {
  id: number;
  type: string;
  icon: string;
  name: string;
};

export type PayLoadType = {
  cargo_type: string;
  hopper: string;
  replacement_hopper: string;
};

export type AddressType = {
  id: number;
  address: string;
  lat: number | null;
  long: number | null;
  radius: number | null;
  ext_id: string;
  deleted?: string;
  orders: Array<OrderType>;
  trip_type: string;
  type: string;
  contractor: ContractorType;
  name: string;
};

export type OrderType = {
  id: number;
  ext_id?: string;
  task_addresses_id: number;
  action: string;
  weight: number;
  volume: number;
  status: string;
  gross_weight: number; //Общий вес
  package_weight: number; //Вес коробки
  plan_arrival: string | null;
  plan_departure: string | null;
  fact_arrival: string | null;
  fact_departure: string | null;
  payload?: PayLoadType;
  address?: string;
  name?: string;
};

export type GeoObjectType = {
  id: number;
  name: string;
  type: string;
  lat: number;
  long: number;
  radius: number;
  address: string;
};

export type ContractorType = {
  id: number;
  ext_id: string;
  name: string;
  code: number;
};

export type CompletedOrderType = {
  taskId?: number;
  orderId?: number;
  addressId?: number;
};

export type commonSettingsType = {
  [key: string]: number | string;
  updateTime: number;
  phone: string;
};

export type executeTaskSettingsType = {
  [key: string]: boolean;
  arbitraryExecutionTasks: boolean;
  chooseWeightTare: boolean;
};

export type completeTaskSettingsType = {
  [key: string]: boolean;
  closeTaskWithoutPhotos: boolean;
  allOrdersComplete: boolean;
};

export type GeoSettingsType = {
  [key: string]: number | boolean;
  geoRadius: number;
  countOfAttempt: number;
  countOfAttemptForCheckingInRadius: number;
  fixTime: number;
  accuracy: number;
  allowPhotoOutSideGeo: boolean;
};

export type SettingsStateType = {
  settings: SettingsType;
  attemptsToCloseOrder: number;
};

export type SettingsType = {
  [key: string]:
    | commonSettingsType
    | executeTaskSettingsType
    | completeTaskSettingsType
    | GeoSettingsType;
  commonSettings: commonSettingsType;
  executeTaskSettings: executeTaskSettingsType;
  completeTaskSettings: completeTaskSettingsType;
  geoSettings: GeoSettingsType;
};

export type TaskType = {
  id: number;
  starttime: string;
  endtime: string;
  addresses: Array<AddressType>;
  comment?: string;
  ext_id: string;
  updated?: string;
  vehicles_id?: string;
  status?: string;
  number?: string;
  empty_weight?: number;
  loaded_weight?: number;
};

export type UserPositionType = {
  lat: number;
  lon: number;
  accuracy: number;
  speed: number | null;
  altitude: number | null;
  distance: number;
  direction: number | null;
};

export type SettingsFromSM = {
  val: string;
  handle: string;
  main: boolean;
};

export type CurrentAddressType = {
  taskId: number | null;
  addressId: number | null;
};

export type CompletedAddressType = {
  taskId: number | null;
  addressId: number | null;
};

export type SyncResponseType = {
  id: number;
};

export type HMSLocationType = {
  latitude: number;
  longitude: number;
  speed: number;
  bearing: number;
  accuracy: number;
  verticalAccuracyMeters: number;
  bearingAccuracyDegrees: number;
  speedAccuracyMetersPerSecond: number;
  time: number;
  fromMockProvider: boolean;
};

export type HWLocationType = {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  bearing: number;
  accuracy: number;
  provider: string;
  verticalAccuracyMeters: number;
  bearingAccuracyDegrees: number;
  elapsedRealtimeNanos: number;
  countryName: string;
  county: string;
  featureName: string;
  postalCode: string;
  phone: string;
  url: string;
  extraInfo: string;
  state: string;
  time: number;
};

export type HMSError = {
  errorCode: number;
  errorMessage: string;
};

export type locationResultType = {
  lastLocation: HMSLocationType;
  locations: Array<HMSLocationType>;
  lastHWLocation: HWLocationType;
  hwLocationList: Array<HWLocationType>;
};

export type TargetAddressType = {
  lat: number;
  lon: number;
};

export type ResponseSettingsType = {
  handle: string;
  val: string;
  main: boolean;
};

export type ContainerType = {
  addressId: number;
  orderId: number;
  value: string;
};

export type ResponseContainerType = {
  id: number;
  name: string;
};
