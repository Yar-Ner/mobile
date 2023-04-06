import {AnyAction} from "redux";

const initialState = {
    photos: [],
}

export const photosReducer = (state = initialState, action: AnyAction) => {
    const {payload, type} = action;
    switch (type) {
        case 'SET_PHOTOS':
            return {
                ...state,
                photos: payload.photos,
            };
        default:
            return state;
    };
};