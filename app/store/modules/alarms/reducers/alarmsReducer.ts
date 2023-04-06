import {AnyAction} from "redux";

const initialState = {
    alarms: [],
}

export const alarmsReducer = (state = initialState, action: AnyAction) => {
    const {payload, type} = action;
    switch (type) {
        case 'SET_ALARMS':
            return {
                ...state,
                alarms: payload.alarms,
            };
        default:
            return state;
    }
};