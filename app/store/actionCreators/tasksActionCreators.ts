import {CompletedAddressType, CompletedOrderType, ContainerType, TaskType} from '../../types';

export const setTasksActionCreator = (tasks: Array<TaskType>) => {
  return {
    type: 'SET_TASKS',
    payload: {tasks: tasks},
  };
};

export const setOrdersCompleteActionCreator = (
  orders: Array<CompletedOrderType>,
) => {
  return {
    type: 'SET_ORDERS_COMPLETE',
    payload: {completedOrders: orders},
  };
};

export const setTasksCompleteActionCreator = (tasks: Array<number>) => {
  return {
    type: 'ADD_COMPLETED_TASKS',
    payload: {completedTasks: tasks},
  };
};

export const setCurrentTaskIdActionCreator = (id: number | null) => {
  return {
    type: 'SET_CURRENT_TASK_ID',
    payload: {currentTaskId: id},
  };
};

export const setSelectedTaskActionCreator = (task: TaskType) => {
  return {
    type: 'SET_SELECTED_TASK',
    payload: {selectedTask: task},
  };
};

export const setCurrentAddressActionCreator = (
  taskId: number | null,
  addressId: number | null,
) => {
  return {
    type: 'SET_CURRENT_ADDRESS',
    payload: {taskId: taskId, addressId: addressId},
  };
};

export const addContainerActionCreator = (container: ContainerType) => {

  return {
    type: 'ADD_CONTAINER',
    payload: {container},
  };
};

export const setCompletedAddressActionCreator = (completedAddresses: Array<CompletedAddressType>) => {

  return {
    type: 'SET_COMPLETED_ADDRESSES',
    payload: {completedAddresses: completedAddresses},
  };
};

