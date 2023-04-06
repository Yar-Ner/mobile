import {AnyAction} from 'redux';
import {CompletedAddressType, CompletedOrderType, ContainerType, CurrentAddressType, TaskType} from "../../../../types";




type TasksStateType = {
  tasks: Array<TaskType>;
  completedOrders: Array<CompletedOrderType>
  completedTasks: Array<number>;
  completedAddresses: Array<CompletedAddressType>
  taskIsComplete: boolean;
  currentTaskId: null | number;
  currentAddress: CurrentAddressType;
  containers: Array<ContainerType>,
  selectedTask: TaskType;
}

const initialState: TasksStateType = {
  tasks: [],
  taskIsComplete: false,
  completedOrders: [],
  completedTasks: [],
  completedAddresses: [],
  currentTaskId: null,
  currentAddress: {
    taskId: null,
    addressId: null,
  },
  selectedTask: {
    id: 0,
    ext_id: '',
    addresses: [],
    comment: "",
    empty_weight: 0,
    endtime: "",
    loaded_weight: 0,
    number: "",
    starttime: "",
    status: "",
    updated: "",
    vehicles_id: ""
  },
  containers: [],
};

export const tasksReducer = (state = initialState, action: AnyAction) => {
  const {payload, type} = action;
  switch (type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: payload.tasks,
      };
    case 'SET_ORDERS_COMPLETE':
      return {
        ...state,
        completedOrders: payload.completedOrders,
      };
    case 'SET_CURRENT_TASK_ID':
      return {
        ...state,
        currentTaskId: payload.currentTaskId,
      };
    case 'SET_SELECTED_TASK':
      return {
        ...state,
        selectedTask: payload.selectedTask,
      };
    case 'SET_CURRENT_ADDRESS':
      return {
        ...state,
        currentAddress: {
          taskId: payload.taskId,
          addressId: payload.addressId,
        },
      };
    case 'ADD_COMPLETED_TASKS':
      return {
        ...state,
        completedTasks: payload.completedTasks,
      };
    case 'ADD_CONTAINER':
      return {
        ...state,
        containers: [...state.containers, payload.container],
      };
    case 'SET_COMPLETED_ADDRESSES':
      return {
        ...state,
        completedAddresses: payload.completedAddresses,
      };
    default:
      return state;
  }
};
