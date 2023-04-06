import {saveToLogFile} from '../../utils/saveLogs';
import {pathToLogFile} from '../../../App';
import {syncPhoto} from './sync-photo';
import {syncAlarms} from './sync-alarms';
import {
  syncArriveToAddress, syncContainers,
  syncFinishedOrders,
  syncFinishedTasks,
  syncLeaveFromAddress,
  syncStartedTasks,
} from './sync-tasks';
import {syncLocationsFromDb} from './sync-location';
import {syncSettings} from "./sync-settings";

export const getDateTime = (): string => {
  let date = new Date(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear(),
    hours = '' + date.getHours(),
    minutes = '' + date.getMinutes(),
    seconds = '' + date.getSeconds();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  if (hours.length < 2) {
    hours = '0' + hours;
  }
  if (minutes.length < 2) {
    minutes = '0' + minutes;
  }
  if (seconds.length < 2) {
    seconds = '0' + seconds;
  }

  return (
    [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':')
  );
};

export const getTime = (): string => {
  let hours =
    new Date().getHours() < 10
      ? `0${new Date().getHours()}`
      : `${new Date().getHours()}`;
  let minutes =
    new Date().getMinutes() < 10
      ? `0${new Date().getMinutes()}`
      : `${new Date().getMinutes()}`;
  let seconds =
    new Date().getSeconds() < 10
      ? `0${new Date().getSeconds()}`
      : `${new Date().getSeconds()}`;
  return `${hours}:${minutes}:${seconds}`;
};

export const getTimeWithoutSeconds = (): string => {
  let hours =
    new Date().getHours() < 10
      ? `0${new Date().getHours()}`
      : `${new Date().getHours()}`;
  let minutes =
    new Date().getMinutes() < 10
      ? `0${new Date().getMinutes()}`
      : `${new Date().getMinutes()}`;
  return `${hours}:${minutes}`;
};

export const getDate = (): string => {
  let date = new Date(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
};

export const syncActions = async (
  token: string,
  prevDate: string = '',
  date: string = '',
) => {
  let results: number[] = [];
  try {
    if (date.length && prevDate.length) {
      results = await Promise.all([
        syncLocationsFromDb(token, prevDate, date),
        syncStartedTasks(token, prevDate, date),
        syncArriveToAddress(token, prevDate, date),
        syncLeaveFromAddress(token, prevDate, date),
        syncFinishedOrders(token, prevDate, date),
        syncFinishedTasks(token, prevDate, date),
        syncAlarms(token, prevDate, date),
        syncPhoto(token, prevDate, date),
      ]);
      return results;
    }
    results = await Promise.all([
      syncStartedTasks(token),
      syncLocationsFromDb(token),
      syncArriveToAddress(token),
      syncLeaveFromAddress(token),
      syncFinishedOrders(token),
      syncFinishedTasks(token),
      syncAlarms(token),
      syncSettings(token),
      syncPhoto(token),
      syncContainers(token),
    ]);
  } catch (error) {
    let datetime = getDateTime();
    saveToLogFile(datetime, pathToLogFile, 'syncActions', error, '');
    return results;
  }
  return results;
};
