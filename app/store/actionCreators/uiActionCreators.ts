export const setLoadingActionCreator = (isLoading: boolean) => {
    return {
        type: 'SET_LOADING',
        payload: {isLoading: isLoading}
    }
};

export const setShowMobileSideBarActionCreator = (isShowSideBar: boolean) => {
    return {
        type: 'SET_SHOW_MOBILE_SIDE_BAR',
        payload: {showMobileSideBar: isShowSideBar}
    }
};

export const updateMessageCounterActionCreator = (counter: number) => {
    return {
        type: 'UPDATE_MESSAGE_COUNTER',
        payload: {messageCounter: counter},
    }
};
