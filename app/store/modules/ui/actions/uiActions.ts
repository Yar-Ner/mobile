import {AnyAction, Dispatch} from "redux";
import {
    setShowMobileSideBarActionCreator,
    updateMessageCounterActionCreator
} from "../../../actionCreators/uiActionCreators";


export const setShowMobileSideBar = (showSideBar: boolean) => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch(setShowMobileSideBarActionCreator(showSideBar));
    };
};

export const updateMessageCounter = (counter: number) => {
    return (dispatch: Dispatch<AnyAction>) => {
        dispatch(updateMessageCounterActionCreator(counter));
    };
}
