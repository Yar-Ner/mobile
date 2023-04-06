import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import {AddressCard} from '../../components/AddressCard/AddressCard';
import TaskScreenStyles from './TaskScreen.styles';
import {AppColors} from '../../theme';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {addAction} from '../../services/database/actions-db';
import {getFinishedTask} from '../../services/database/tasks-db';
import {getStartedTask} from '../../services/database/tasks-db';
import {RootState} from '../../store/store';
import ErrorAlert from '../../components/ErrorAlert/ErorAlert';
import {useNavigation} from '@react-navigation/native';
import Device from 'react-native-device-detection';
import {TaskStatuses} from '../../utils/statuses';
import {
  CompletedAddressType,
  CompletedOrderType,
  ContainerType,
  OrderType,
  SettingsType,
  TaskType,
} from '../../types';
import {
  setCompletedAddresses,
  setCurrentAddress,
  setCurrentTaskId,
  setOrdersComplete,
  setTasksComplete,
} from '../../store/modules/tasks/actions/tasksActions';
import {getTime} from '../../services/sync/sync';
import WarningAlert from '../../components/WarningAlert/WarningAlert';
import InputModal from '../../components/InputModal/InputModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import ChooseModal from '../../components/ChooseModal/ChooseModal';

export const TaskScreen: React.FC = () => {
  const navigation = useNavigation();

  const odometerInitialState = {
    taskId: 0,
    value: '0',
  };
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showOdometerModal, setShowOdometerModal] = useState(false);
  const [visibleSuccessCompleteModal, setVisibleSuccessCompleteModal] =
    useState(false);
  const [comment, setComment] = useState('');
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [odometer, setOdometer] = useState(odometerInitialState);
  const [odometerTextError, setOdometerTextError] = useState('');
  const completedOrders = useSelector<RootState, Array<CompletedOrderType>>(
    state => state.tasksState.completedOrders,
    shallowEqual,
  );
  const settings = useSelector<RootState, SettingsType>(
    state => state.settingsState.settings,
    shallowEqual,
  );
  const currentTaskId = useSelector<RootState, number | null>(
    state => state.tasksState.currentTaskId,
    shallowEqual,
  );

  const selectedTask = useSelector<RootState, TaskType>(
    state => state.tasksState.selectedTask,
  );

  const containers = useSelector<RootState, Array<ContainerType>>(
    state => state.tasksState.containers,
  );
  const completedTasks = useSelector<RootState, Array<number>>(
    state => state.tasksState.completedTasks,
    shallowEqual,
  );
  const [allCompletedOrdersFromAddresses, setAllCompletedOrdersFromAddresses] =
    useState<Array<CompletedOrderType>>(completedOrders);

  const vehicleId = useSelector<RootState, number | null>(
    state => state.carsState.car.id,
    shallowEqual,
  );

  const carType = useSelector<RootState, number | null>(
    state => state.carsState.car.type,
  );

  const token = useSelector<RootState, string>(
    state => state.userState.user.token,
    shallowEqual,
  );

  const [taskStartedId, setTaskStartedId] = useState(-1);
  const [taskFinishedId, setTaskFinishedId] = useState(0);
  const [countOfCompletedAddresses, setCountOfCompletedAddresses] =
    useState<number>(0);
  const [isTaskStarted, setIsTaskStarted] = useState(false);
  const [isTaskFinished, setIsTaskFinished] = useState(false);

  const dispatch = useDispatch();

  let tempCompletedOrders: Array<CompletedOrderType> = [];

  useLayoutEffect(() => {
    dispatch(setOrdersComplete([...new Set(allCompletedOrdersFromAddresses)]));
  }, [dispatch, allCompletedOrdersFromAddresses]);

  useLayoutEffect(() => {
    dispatch(
      setTasksComplete([...new Set([...completedTasks, taskFinishedId])]),
    );
  }, [taskFinishedId, dispatch]);

  useEffect(() => {
    if (
      selectedTask !== undefined &&
      currentTaskId !== null &&
      currentTaskId === selectedTask.id
    ) {
      setIsTaskStarted(true);
    } else {
      setIsTaskStarted(false);
    }
  }, [currentTaskId]);

  useEffect(() => {
    let _taskIsFinished =
      completedTasks.findIndex(id => id === selectedTask.id) !== -1;
    setIsTaskFinished(_taskIsFinished);
  }, [completedTasks, selectedTask.id]);

  useEffect(() => {
    if (taskStartedId !== currentTaskId) {
      setTaskStartedId(-1);
    }
  }, [taskStartedId, currentTaskId]);

  const addCompletedOrdersInState = (
    orderFromTask: CompletedOrderType,
    action: string,
  ) => {
    if (action === 'removed') {
      const newState = allCompletedOrdersFromAddresses.filter(
        (item: CompletedOrderType) => item.orderId !== orderFromTask.orderId,
      );
      let time = getTime();
      setAllCompletedOrdersFromAddresses(newState);
      addAction({
        type: 'deleted',
        time: time,
        taskId: orderFromTask.taskId,
        addressId: orderFromTask.addressId,
        orderId: orderFromTask.orderId,
        synced: 'false',
      });
    } else if (
      allCompletedOrdersFromAddresses
        .map(item => item.orderId)
        .indexOf(orderFromTask.orderId) === -1
    ) {
      let time = getTime();
      tempCompletedOrders.push(orderFromTask);
      setAllCompletedOrdersFromAddresses(prevState =>
        prevState.concat(tempCompletedOrders),
      );
      addAction({
        type: 'completed',
        time: time,
        taskId: orderFromTask.taskId,
        addressId: orderFromTask.addressId,
        orderId: orderFromTask.orderId,
        synced: 'false',
      });
    }
  };
  const handleChangeText = (value: string) => {
    setComment(value);
  };
  const closeCompleteModal = () => {
    setShowCompleteModal(false);
  };
  const closeSuccessCompleteModal = () => {
    setVisibleSuccessCompleteModal(false);
  };
  const handleCompleteButtonClick = () => {
    closeCompleteModal();
    setVisibleSuccessCompleteModal(true);
    setTaskFinishedId(selectedTask.id);
    setTaskStartedId(-1);
    let time = getTime();
    addAction({
      type: 'finish',
      time: time,
      taskId: selectedTask.id,
      odometer: +odometer.value,
      synced: 'false',
    });
    dispatch(setCurrentTaskId(-1));
    dispatch(setCurrentAddress(-1, -1));
  };
  const handleTaskStart = () => {
    let time = getTime();
    let addressesFromCompletedOrders = completedOrders.map(
      order => order.addressId,
    );
    let currentAddressId = selectedTask.addresses.find(
      address => !addressesFromCompletedOrders.includes(address.id),
    )?.id;

    if (currentTaskId !== null && currentTaskId > -1) {
      ErrorAlert('Вы не можете начать задачу пока не закончите предыдущую');
      return;
    }
    dispatch(setCurrentTaskId(selectedTask.id));
    if (
      currentAddressId !== undefined &&
      !settings.executeTaskSettings.arbitraryExecutionTasks
    ) {
      dispatch(setCurrentAddress(selectedTask.id, currentAddressId));
    }
    setTaskStartedId(selectedTask.id);
    addAction({
      type: 'start',
      time: time,
      taskId: selectedTask.id,
      synced: 'false',
    });
  };
  const handleTaskComplete = () => {
    if (
      !checkSelectedContainers() &&
      (carType === 1 || carType === 2 || carType === 3)
    ) {
      WarningAlert('Вы забыли указать бункер / бункер для разгрузки');
      return;
    }

    setShowOdometerModal(true);
    //dispatch(setcurrentTaskId(null));
  };

  const _renderFooter = () => {
    if (selectedTask !== undefined && selectedTask.addresses.length > 0) {
      return (
        <View style={TaskScreenStyles.listFooter}>
          <TouchableOpacity
            onPress={() => {
              handleTaskComplete();
            }}
            disabled={
              (!isTaskComplete &&
                !settings?.completeTaskSettings.allOrdersComplete) ||
              (currentTaskId !== selectedTask.id &&
                !settings?.completeTaskSettings.allOrdersComplete) ||
              currentTaskId !== selectedTask.id
            }
            style={[
              (!isTaskComplete &&
                !settings?.completeTaskSettings.allOrdersComplete) ||
              (currentTaskId !== selectedTask.id &&
                !settings?.completeTaskSettings.allOrdersComplete) ||
              currentTaskId !== selectedTask.id
                ? TaskScreenStyles.completeButtonInActive
                : TaskScreenStyles.completeButtonActive,
            ]}>
            <Text
              style={[
                (!isTaskComplete &&
                  !settings?.completeTaskSettings.allOrdersComplete) ||
                (currentTaskId !== selectedTask.id &&
                  !settings?.completeTaskSettings.allOrdersComplete) ||
                currentTaskId !== selectedTask.id
                  ? TaskScreenStyles.completeButtonText
                  : TaskScreenStyles.completeButtonTextActive,
              ]}>
              Завершить Маршрут
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View />;
    }
  };

  const getAddress = useCallback(
    (addressId: number | undefined) => {
      if (addressId !== undefined) {
        return selectedTask.addresses.find(address => address.id === addressId);
      }
    },
    [selectedTask.addresses],
  );

  const getOrdersFromAddress = useCallback(
    (addressId: number | undefined) => {
      let targetAddress = selectedTask.addresses.find(
        address => address.id === addressId,
      );
      return targetAddress?.orders;
    },
    [selectedTask.addresses],
  );

  const getCompletedOrdersFromAddress = useCallback(
    (address_id: number | undefined, task_id: number | undefined) => {
      return completedOrders.filter(
        (item: CompletedOrderType) =>
          item.addressId === address_id && item.taskId === task_id,
      );
    },
    [completedOrders],
  );

  const getCompletedAddresses = useCallback(() => {
    let allOrdersForAddress: Array<OrderType> | undefined = [];
    let completedOrdersFromAddress = [];
    let completedAddresses = [];

    for (let i = 0; i < selectedTask.addresses.length; i++) {
      allOrdersForAddress = getOrdersFromAddress(selectedTask.addresses[i].id);

      completedOrdersFromAddress = getCompletedOrdersFromAddress(
        selectedTask.addresses[i].id,
        selectedTask.id,
      );
      completedOrdersFromAddress = [
        ...new Set(
          completedOrdersFromAddress.map(order => JSON.stringify(order)),
        ),
      ].map(string => JSON.parse(string));

      if (completedOrdersFromAddress.length === allOrdersForAddress?.length) {
        let completedAddress: CompletedAddressType = {
          taskId: selectedTask.id,
          addressId: selectedTask.addresses[i].id,
        };
        completedAddresses.push(completedAddress);
      }
    }
    completedAddresses = [...new Set(completedAddresses)];

    console.log('completedAddresses:', completedAddresses);

    return completedAddresses;
  }, [
    completedOrders,
    getOrdersFromAddress,
    getAddress,
    getCompletedOrdersFromAddress,
    selectedTask.id,
  ]);

  const checkSelectedContainers = () => {
    let allOrdersForAddress: Array<OrderType> | undefined = [];
    let allContainersForAddress: Array<ContainerType> = [];

    for (let i = 0; i < selectedTask.addresses.length; i++) {
      allOrdersForAddress = getOrdersFromAddress(selectedTask.addresses[i].id);
      allContainersForAddress = containers.filter(
        container => container.addressId === selectedTask.addresses[i].id,
      );
    }

    return (
      allOrdersForAddress?.length !== undefined &&
      allContainersForAddress.length === allOrdersForAddress?.length * 2
    );
  };

  useEffect(() => {
    let mounted = true;

    if (mounted && selectedTask !== undefined) {
      setCountOfCompletedAddresses(getCompletedAddresses().length);
      console.log('countOfCompletedAddresses:', countOfCompletedAddresses);

      dispatch(setCompletedAddresses(getCompletedAddresses()));

      if (
        countOfCompletedAddresses !== undefined &&
        !settings.executeTaskSettings.arbitraryExecutionTasks &&
        currentTaskId
      ) {
        dispatch(
          setCurrentAddress(
            selectedTask.id,
            selectedTask.addresses[countOfCompletedAddresses]?.id,
          ),
        );
      }
      if (
        selectedTask.addresses !== null &&
        countOfCompletedAddresses === selectedTask.addresses.length
      ) {
        setIsTaskComplete(true);
      } else {
        setIsTaskComplete(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [
    currentTaskId,
    countOfCompletedAddresses,
    selectedTask.addresses,
    getCompletedAddresses,
    settings.executeTaskSettings.arbitraryExecutionTasks,
  ]);
  useEffect(() => {
    getStartedTask(selectedTask.id).then(result => {
      if (
        (result.length && currentTaskId === null && taskFinishedId === 0) ||
        (result.length && currentTaskId === -1 && taskFinishedId === 0)
      ) {
        //@ts-ignore
        setTaskStartedId(result[0].task_id);
        dispatch(setCurrentTaskId(selectedTask.id));
      } else if (
        (selectedTask.status === TaskStatuses.process &&
          currentTaskId === null &&
          taskFinishedId === 0) ||
        (selectedTask.status === TaskStatuses.process &&
          currentTaskId === -1 &&
          taskFinishedId === 0)
      ) {
        setTaskStartedId(selectedTask.id);
        dispatch(setCurrentTaskId(selectedTask.id));
        let time = getTime();
        addAction({
          type: 'start',
          time: time,
          taskId: selectedTask.id,
          synced: 'false',
        });
      }
    });
    getFinishedTask(selectedTask.id).then(result => {
      if (result.length) {
        setTaskFinishedId(result[0].task_id);
        setTaskStartedId(-1);
        dispatch(setCurrentTaskId(-1));
      } else if (selectedTask.status === TaskStatuses.done) {
        setTaskFinishedId(selectedTask.id);
        setTaskStartedId(-1);
        dispatch(setCurrentTaskId(-1));
        let time = getTime();
        addAction({
          type: 'finish',
          time: time,
          taskId: selectedTask.id,
          synced: 'true',
        });
      } else {
        setTaskFinishedId(0);
      }
    });
  }, [
    selectedTask.id,
    selectedTask.status,
    currentTaskId,
    dispatch,
    token,
    vehicleId,
    taskFinishedId,
  ]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const isCompleted =
        completedTasks.findIndex(id => id === selectedTask.id) !== -1;

      setIsTaskCompleted(isCompleted);
    }
  }, [completedTasks, selectedTask.id]);

  const getStylesForHeader = () => {
    if (!Device.isTablet) {
      return TaskScreenStyles.subTasksContainerHeaderTextMobile;
    } else if (Device.isTablet) {
      return TaskScreenStyles.subTasksContainerHeaderText;
    }
  };

  const _renderHeader = useCallback(() => {
    return selectedTask !== undefined && selectedTask.addresses.length > 0 ? (
      <View style={TaskScreenStyles.listHeader}>
        {selectedTask.id === taskStartedId ||
        selectedTask.id === currentTaskId ? (
          <Text style={getStylesForHeader()}>
            Заданий выполнено {countOfCompletedAddresses}/
            {selectedTask.addresses.length}
          </Text>
        ) : (
          <TouchableOpacity
            onPress={() => handleTaskStart()}
            style={[
              isTaskCompleted
                ? TaskScreenStyles.startButtonInActive
                : TaskScreenStyles.startButton,
            ]}
            disabled={isTaskCompleted}>
            <Text
              style={[
                isTaskCompleted
                  ? TaskScreenStyles.completeButtonText
                  : TaskScreenStyles.startButtonTextActive,
              ]}>
              Начать выполнение
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ) : (
      <View />
    );
  }, [selectedTask, isTaskCompleted]);
  const handleCloseOdometerModal = (value: string) => {
    if (isNaN(+value)) {
      setOdometerTextError('Введенное значение не число');
      return;
    }
    if (value.length > 6) {
      setOdometerTextError('Значение не должно превышать 6 цифр');
      return;
    }
    if (value === '0') {
      setOdometerTextError('Вы не указали показания одометра');
      return;
    }
    setOdometer({
      taskId: selectedTask.id,
      value: Number(value).toString(),
    });
    setOdometerTextError('');
    setShowOdometerModal(false);
    setShowCompleteModal(true);
  };

  return (
    <SafeAreaView style={TaskScreenStyles.container}>
      <View style={TaskScreenStyles.infoContainer}>
        {selectedTask.id === 0 ? (
          <View style={TaskScreenStyles.emptyAssignsTextContainer}>
            <Text style={TaskScreenStyles.emptyAssignsText}>
              В данный момент вы не выполняете маршрутный лист{'\n'}Выберите
              машрутный лист из списка
            </Text>
          </View>
        ) : (
          <View>
            <FlatList
              style={TaskScreenStyles.subTasksContainer}
              data={selectedTask.addresses}
              ListHeaderComponent={_renderHeader}
              keyExtractor={(item, _) => item.ext_id}
              renderItem={({item, index}) => (
                <AddressCard
                  key={index}
                  addressId={item.id}
                  assignFinished={isTaskFinished}
                  assignStarted={isTaskStarted}
                  addressName={item.name}
                  addressNumber={index + 1}
                  companyName={item.contractor?.name || ''}
                  address={item.address}
                  lat={item.lat}
                  lon={item.long}
                  radius={item.radius || 0}
                  orders={item.orders}
                  completedOrdersHandler={addCompletedOrdersInState}
                  assignId={selectedTask.id}
                  navigation={navigation}
                  addressStatus={item.type}
                />
              )}
              ListFooterComponent={_renderFooter}
            />
          </View>
        )}
      </View>
      <InputModal
        title="Ввод показателя одометра"
        keyBoardType="numeric"
        isVisible={showOdometerModal}
        inputError={odometerTextError}
        handleClose={() => setShowOdometerModal(false)}
        submitValue={value => handleCloseOdometerModal(value)}
      />
      <ChooseModal
        title={`Вы готовы \n завершить маршрут?`}
        isVisible={showCompleteModal}
        handleClose={closeCompleteModal}>
        <View style={TaskScreenStyles.completeModalBody}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            placeholder={'Комментарий...'}
            placeholderTextColor={AppColors.TaskColor}
            style={TaskScreenStyles.completeModalTextArea}
            value={comment}
            onChangeText={value => handleChangeText(value)}
          />
          <TouchableOpacity
            onPress={() => handleCompleteButtonClick()}
            style={TaskScreenStyles.completeButtonModal}>
            <Text style={TaskScreenStyles.completeButtonModalText}>
              Завершить Маршрут
            </Text>
          </TouchableOpacity>
        </View>
      </ChooseModal>
      <SuccessModal
        title={`Маршрут М${selectedTask.number} завершен`}
        isVisible={visibleSuccessCompleteModal}
        handleClose={closeSuccessCompleteModal}
      />
    </SafeAreaView>
  );
};
