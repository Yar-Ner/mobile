import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import Assign, {SelectedAssignType} from '../Assign/Assign';
import {TaskType} from '../../types';

type TaskListPropsType = {
  data: Array<TaskType>;
  selectedTask: TaskType;
  onSelect: (task: SelectedAssignType) => void;
};

const TaskList: React.FC<TaskListPropsType> = ({
  data,
  selectedTask,
  onSelect,
}) => {
  const renderItem = useCallback(
    ({item, index}: {item: TaskType; index: number}) => (
      <Assign
        key={item.id}
        id={item.id}
        ext_id={item.ext_id}
        assignNumber={index + 1}
        addresses={item.addresses}
        startTime={item.starttime}
        endTime={item.endtime}
        onSelect={onSelect}
        selected={selectedTask}
        status={item.status || ''}
        empty_weight={item.empty_weight || 0}
        loaded_weight={item.loaded_weight || 0}
      />
    ),
    [],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.ext_id}
      renderItem={renderItem}
      initialNumToRender={10}
    />
  );
};

export default TaskList;
