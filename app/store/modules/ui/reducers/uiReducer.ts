import {AnyAction} from "redux";

const initialState = {
    isLoadingData: false,
    isLoadingScreen: false,
    showMobileSideBar: false,
    messageCounter: 0,
};

export const uiReducer = (state = initialState, action: AnyAction) => {
    const {payload, type} = action;
    switch (type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoadingData: payload.isLoading,
                isLoadingScreen: payload.isLoadingScreen,
            };
        case 'SET_SHOW_MOBILE_SIDE_BAR':
            return {
                ...state,
                showMobileSideBar: payload.showMobileSideBar,
            };
        case 'UPDATE_MESSAGE_COUNTER':
            return {
                ...state,
                messageCounter: payload.messageCounter,
            };
        default:
            return state;
    }
};
