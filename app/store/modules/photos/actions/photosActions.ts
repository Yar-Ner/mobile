import {AnyAction, Dispatch} from "redux";
import {setPhotosActionCreator} from "../../../actionCreators/photosActionCreators";
import {Photo} from "../../../../types";


export const setPhotos = (photos: Array<Photo>) => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch(setPhotosActionCreator(photos));
    };
};




