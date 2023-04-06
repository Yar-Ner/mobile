import {AlarmType} from "../../types";

export const setAlarmsActionCreator = (alarms: Array<AlarmType>) => {
    return {
        type: 'SET_ALARMS',
        payload: {alarms: alarms}
    };
};