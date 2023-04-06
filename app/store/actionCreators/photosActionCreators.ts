import {Photo} from "../../types";

export const setPhotosActionCreator = (photos: Array<Photo>) => {
    return {type: 'SET_PHOTOS', payload: {photos: photos}}
};