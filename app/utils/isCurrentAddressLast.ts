import {CompletedAddressType} from "../types";

export const isCurrentAddressLast = (currentTaskId: number, completedAddresses: Array<CompletedAddressType>) => {
    let [lastCompletedAddress] =
        completedAddresses.filter(completedAddress => completedAddress.taskId === currentTaskId).slice(-1);

    return !!lastCompletedAddress;
};
