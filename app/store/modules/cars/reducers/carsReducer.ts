import {AnyAction} from "redux";
import {Car} from "../../../../types";


type carState = {
    car: Car;
    cars: Array<Car>;
    carWeight: number;
    loadedCarWeight: number;
    odometer: number;
}

const initialState: carState = {
    car: {
        id: null,
        name: null,
        number: null,
        color: null,
        weight: null,
        type: null,
        containers: [],
    },
    cars: [],
    carWeight: 0,
    loadedCarWeight: 0,
    odometer: 0,
}

export const carsReducer = (state = initialState, action: AnyAction) => {
    const {payload, type} = action;
    switch (type) {
        case 'SAVE_CAR':
            return {
                ...state,
                car: payload.car,
                isLoadingScreen: false,
                carIsSelect: true,
            };
        case 'GET_CARS':
            return {
                ...state,
                cars: payload.cars,
                isLoadingData: false,
            };
        case 'UPDATE_LOADED_CAR_WEIGHT':
            return {
                ...state,
                loadedCarWeight: payload.loadedCarWeight,
            };
        case 'UPDATE_CAR_WEIGHT':
            return {
                ...state,
                carWeight: payload.carWieght,
            };
        case 'UPDATE_ODOMETER':
            return {
                ...state,
                odometer: payload.odometer,
            };
        default:
            return state;
    }
}
