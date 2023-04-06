import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import AssignStyles from './Assign.styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {AddressType, OrderType, TaskType} from "../../types";

export type SelectedAssignType = {
  id: number;
  ext_id: string;
  starttime: string;
  endtime: string;
  addresses: Array<AddressType>;
  status?: string;
  empty_weight: number;
  loaded_weight: number;
};

type AssignComponentType = {
  id: number;
  ext_id: string;
  startTime: string;
  endTime: string;
  addresses: Array<AddressType>;
  onSelect: Function;
  selected: TaskType;
  assignNumber: number;
  status: string;
  empty_weight: number;
  loaded_weight: number;
};

const Assign: React.FC<AssignComponentType> = ({
  id,
  ext_id,
  addresses,
  onSelect,
  selected,
  startTime,
  endTime,
  status,
  assignNumber,
  empty_weight,
  loaded_weight,
}) => {
  const completedAssigns = useSelector<RootState, number[]>(
    state => state.tasksState.completedTasks,
  );

  const hasInCompletedAssigns = completedAssigns.indexOf(id) !== -1;

  const SelectValue = (
    selectId: number,
    selectExtId: string,
    selectAddresses: Array<AddressType>,
    selectStartTime: string,
    selectEndTime: string,
    selectEmptyWeight: number,
    selectLoadedWeight: number,
  ) => {
    let selectOrders = selectAddresses.reduce((acc: OrderType[], item) => {
      return acc.push(...item.orders), acc;
    }, []);

    const assign = {
      id: selectId,
      ext_id: selectExtId,
      orders: selectOrders,
      addresses: selectAddresses,
      startTime: selectStartTime,
      endTime: selectEndTime,
      status: status,
      number: assignNumber,
      empty_weight: selectEmptyWeight,
      loaded_weight: selectLoadedWeight,
    };
    onSelect(assign);
  };

  const getStyleForAssignButton = () => {
    if (id === selected.id) {
      return AssignStyles.assignButtonSelected;
    }

    if (hasInCompletedAssigns) {
      return AssignStyles.assignButtonCompleted;
    }

    if (status === 'done') {
      return AssignStyles.assignButtonCompleted;
    }

    return AssignStyles.assignButton;
  };

  return (
    <TouchableOpacity
      onPress={() =>
        SelectValue(
          id,
          ext_id,
          addresses,
          startTime,
          endTime,
          empty_weight,
          loaded_weight,
        )
      }
      style={getStyleForAssignButton()}>
      <Text style={AssignStyles.assignButtonText}>M{assignNumber}</Text>
    </TouchableOpacity>
  );
};

export default Assign;
