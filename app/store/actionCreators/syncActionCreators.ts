export const setStartSyncActionCreator = (isStartSynced: boolean) => {
    return {
        type: 'SET_START_SYNC',
        payload: {isStartSynced: isStartSynced},
    };
};

export const setSyncTimeActionCreator = (syncTime: string) => {
    return {
        type: 'SET_SYNC_TIME',
        payload: {syncTime: syncTime},
    };
};

