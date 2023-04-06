import {Car} from "../../types";

export const getCarsActionCreator = (cars: Array<Car>) => {
    return {
        type: 'GET_CARS',
        payload: {cars: cars}
    }
};

export const saveCarActionCreator = (car: Car) => {
    return {
        type: 'SAVE_CAR',
        payload: {car: car}
    }
};

export const updateCarWeightActionCreator = (carWeight: number) => {
    return {
        type: 'UPDATE_CAR_WEIGHT',
        payload: {carWeight: carWeight},
    }
};

export const updateLoadedCarWeighActionCreator = (loadedCarWeight: number) => {
    return {
        type: 'UPDATE_LOADED_CAR_WEIGHT',
        payload: {loadedCarWeight: loadedCarWeight},
    }
};

export const updateOdometerActionCreator = (odometer: number) => {
    return {
        type: 'UPDATE_ODOMETER',
        payload: {odometer: odometer},
    }
};
