import {catchingAxiosErrors, instance} from "./api";
import {ResponseContainerType} from "../../types";


export const carsApi = {
    getContainers() {
        return instance
            .get<ResponseContainerType>(`/vehicles/containers`)
            .then(res => res.data)
            .catch(error => {
                throw new Error(catchingAxiosErrors(error));
            });
    }
}
