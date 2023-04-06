import {SettingsType} from "../../types";

export const setSettingsActionCreator = (settings: SettingsType) => {
    return {
        type: 'SET_SETTINGS',
        payload: {settings: settings}
    };
};

export const setAttemptsToCloseOrderActionCreator = (attempt: number) => {
    return {
        type: 'SET_ATTEMPT_TO_CLOSE_ORDER',
        payload: {attemptsToCloseOrder: attempt},
    }
};