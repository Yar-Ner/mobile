import {AnyAction} from "redux";

const initialState = {
    isStartSynced: false,
    syncTime: '',
}

export const syncReducer = (state = initialState, action: AnyAction) => {
    const {payload, type} = action;
    switch (type) {
        case 'SET_SYNC_TIME':
            return {
                ...state,
                syncTime: payload.syncTime,
            };
        case 'SET_START_SYNC':
            return {
                ...state,
                isStartSynced: payload.isStartSynced,
            };
        default:
            return state;
    };
};