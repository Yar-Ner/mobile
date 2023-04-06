import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import SettingsScreenStyles from './SettingsScreen.styles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {SettingsType} from '../../types';
import {setLocaleSettings} from '../../store/modules/settings/actions/settingsActions';
import SettingCardWithCheckBox from '../../components/SettingCardWithCheckBox/SettingCardWithCheckBox';
import SettingCard from '../../components/SettingCard/SettingCard';
import RadioModal from "../../components/RadioModal/RadioModal";
import PhoneModal from "../../components/PhoneModal/PhoneModal";

export const SettingsScreen: React.FC = () => {
  const settings = useSelector<RootState, SettingsType>(
    state => state.settingsState.settings,
  );
  let localSettings = settings;
  const [showChangeUpdateTimeModal, setShowChangeUpdateTimeModal] =
    useState(false);

  const [showChangeUpdateGeoTimeModal, setShowChangeUpdateGeoTimeModal] =
    useState(false);
  const [showChangeUpdateRadiusModal, setShowChangeUpdateRadiusModal] =
    useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  const [showChangeCountOfAttemptModal, setShowChangeCountOfAttemptModal] =
    useState(false);
  const [
    showChangeCountOfAttemptForCheckingInRadiusModal,
    setShowChangeCountOfAttemptForCheckingInRadiusModal,
  ] = useState(false);
  const dispatch = useDispatch();

  const settingItems = {
    commonSettings: [
      {
        id: 1,
        title: 'Периодичность запросов от мобильного приложения',
        description: `Периодичность запросв от мобильного приложения: каждые ${
          localSettings.commonSettings.updateTime / 1000
        } c`,
        changeValue: () => {
          setShowChangeUpdateTimeModal(true);
        },
      },
      {
        id: 2,
        title: 'Номер телефона для связи с логистом',
        description: `${localSettings.commonSettings.phone}`,
        changeValue: () => {
          setShowChangePhoneModal(true);
        },
      },
    ],
    executeTaskSettings: [
      {
        id: 1,
        title: 'Порядок выполнения заданий',
        description: 'Разрешить выполнять задания в произвольном порядке',
        value: localSettings.executeTaskSettings.arbitraryExecutionTasks,
      },
    ],
    completeTaskSettings: [
      {
        id: 3,
        title: 'Возможность закрытия задач без фотографий',
        description: 'Позволяет закрывать МЗ без добавления фотографий',
        value: localSettings.completeTaskSettings.closeTaskWithoutPhotos,
      },
      {
        id: 4,
        title: 'Завершение МЛ только при закрытии всех задач',
        description:
          'Если стоит галка, то можно закрывать МЛ без закрытия всех задач',
        value: localSettings.completeTaskSettings.allOrdersComplete,
      },
    ],
    geoSettings: [
      {
        id: 1,
        title: 'Радиус зоны',
        description: `Радиус геозоны по умолчанию: ${localSettings.geoSettings.geoRadius} метров`,
        changeValue: () => {
          setShowChangeUpdateRadiusModal(true);
        },
      },
      {
        id: 2,
        title: 'Время фиксации положения в геозоне',
        description: `Время, которое необходимо провести в радиусе геозоны для фиксации: ${
          localSettings.geoSettings.fixTime / 1000
        }`,
        changeValue: () => {
          setShowChangeUpdateGeoTimeModal(true);
        },
      },
      {
        id: 3,
        title: 'Количество попыток для закрытия МЗ вне радиуса',
        description: `Сколько МЗ можно закрыть находясь вне радиуса: ${localSettings.geoSettings.countOfAttempt}`,
        changeValue: () => {
          setShowChangeCountOfAttemptModal(true);
        },
      },
      {
        id: 4,
        title:
          'Количество попыток для проверки, что пользователь не в радиусе выполнения МЗ',
        description: `Сколько раз будет проверяться, что пользователь находится не в радиусе выполнения МЗ: ${localSettings.geoSettings.countOfAttemptForCheckingInRadius}`,
        changeValue: () => {
          setShowChangeCountOfAttemptForCheckingInRadiusModal(true);
        },
      },
      {
        id: 5,
        title: 'Возможность фотофиксации вне радиуса',
        description: 'Позволяет сделать фотофиксацию вне радиуса',
        value: localSettings.geoSettings.allowPhotoOutSideGeo,
      },
    ],
  };

  const updateTimeValues = [
    {
      id: 1,
      label: '30 секунд',
      value: 30000,
    },
    {
      id: 2,
      label: '1 минута',
      value: 60000,
    },
    {
      id: 3,
      label: '2 минуты',
      value: 120000,
    },
    {
      id: 4,
      label: '5 минут',
      value: 300000,
    },
    {
      id: 5,
      label: '10 минут',
      value: 600000,
    },
    {
      id: 6,
      label: '15 минут',
      value: 900000,
    },
    {
      id: 7,
      label: '20 минут',
      value: 1200000,
    },
  ];

  const radiusValues = [
    {
      id: 1,
      label: '5 метров',
      value: 5,
    },
    {
      id: 2,
      label: '25 метров',
      value: 25,
    },
    {
      id: 3,
      label: '45 метров',
      value: 45,
    },
    {
      id: 4,
      label: '55 метров',
      value: 55,
    },
    {
      id: 5,
      label: '65 метров',
      value: 65,
    },
    {
      id: 6,
      label: '75 метров',
      value: 75,
    },
    {
      id: 7,
      label: '85 метров',
      value: 85,
    },
    {
      id: 8,
      label: '95 метров',
      value: 95,
    },
    {
      id: 9,
      label: '100 метров',
      value: 100,
    },
  ];
  const countOfAttemptValues = [
    {
      id: 1,
      label: '1 попытка',
      value: 1,
    },
    {
      id: 2,
      label: '3 попытки',
      value: 3,
    },
    {
      id: 3,
      label: '5 попыток',
      value: 5,
    },
  ];

  const countOfAttemptForCheckingInRadiusValues = [
    {
      id: 1,
      label: '1 попытка',
      value: 1,
    },
    {
      id: 2,
      label: '3 попытки',
      value: 3,
    },
    {
      id: 3,
      label: '5 попыток',
      value: 5,
    },
  ];

  const setValue = (id: number, value: boolean) => {
    if (id === 1) {
      localSettings.executeTaskSettings.arbitraryExecutionTasks = value;
    }

    if (id === 2) {
      localSettings.executeTaskSettings.chooseWeightTare = value;
    }

    if (id === 3) {
      localSettings.completeTaskSettings.closeTaskWithoutPhotos = value;
    }

    if (id === 4) {
      localSettings.completeTaskSettings.allOrdersComplete = value;
    }

    if (id === 5) {
      localSettings.geoSettings.allowPhotoOutSideGeo = value;
    }

    dispatch(setLocaleSettings({...settings, ...localSettings}));
  };

  const onPressUpdateTimeRadio = (value: number) => {
    localSettings.commonSettings.updateTime = value;
    dispatch(setLocaleSettings({...settings, ...localSettings}));
    setShowChangeUpdateTimeModal(false);
  };

  const onPressUpdateGeoTimeRadio = (value: number) => {
    localSettings.geoSettings.fixTime = value;
    dispatch(setLocaleSettings({...settings, ...localSettings}));
    setShowChangeUpdateGeoTimeModal(false);
  };

  const onPressUpdateRadius = (value: number) => {
    localSettings.geoSettings.geoRadius = value;
    dispatch(setLocaleSettings({...settings, ...localSettings}));
    setShowChangeUpdateRadiusModal(false);
  };

  const onPressUpdateCountOfAttempt = (value: number) => {
    localSettings.geoSettings.countOfAttempt = value;
    dispatch(setLocaleSettings({...settings, ...localSettings}));
    setShowChangeCountOfAttemptModal(false);
  };

  const onPressUpdateCountOfAttemptForCheckingInRadius = (value: number,) => {
    localSettings.geoSettings.countOfAttemptForCheckingInRadius = value;
    setShowChangeCountOfAttemptForCheckingInRadiusModal(false);
    dispatch(setLocaleSettings({...settings, ...localSettings}));
  };

  const handlePhoneChange = (phone: string) => {
    localSettings.commonSettings.phone = phone;
    dispatch(setLocaleSettings({...settings, ...localSettings}));
    setShowChangePhoneModal(false);
  };

  return (
    <SafeAreaView style={SettingsScreenStyles.container}>
      <ScrollView nestedScrollEnabled>
        <View style={SettingsScreenStyles.settingsContainer}>
          <Text style={SettingsScreenStyles.settingsTitle}>
            Общие настройки
          </Text>
          {settingItems.commonSettings.map((item, index) => (
            <SettingCard
              key={index}
              title={item.title}
              description={item.description}
              onPress={item.changeValue}
            />
          ))}
        </View>
        <View style={SettingsScreenStyles.settingsContainer}>
          <Text style={SettingsScreenStyles.settingsTitle}>
            Выполнение задания
          </Text>
          {settingItems.executeTaskSettings.map((item, index) => (
            <SettingCardWithCheckBox
              id={item.id}
              key={index}
              title={item.title}
              description={item.description}
              value={item.value}
              onChange={(id: number, value: boolean) => setValue(id, value)}
            />
          ))}
        </View>
        <View style={SettingsScreenStyles.settingsContainer}>
          <Text style={SettingsScreenStyles.settingsTitle}>
            Завершение задания
          </Text>
          {settingItems.completeTaskSettings.map((item, index) => (
            <SettingCardWithCheckBox
              id={item.id}
              key={index}
              title={item.title}
              description={item.description}
              value={item.value}
              onChange={(id: number, value: boolean) => setValue(id, value)}
            />
          ))}
        </View>
        <View style={SettingsScreenStyles.settingsContainer}>
          <Text style={SettingsScreenStyles.settingsTitle}>Гео</Text>
          {settingItems.geoSettings.map((item, index) => {
            return typeof item.value === 'boolean' ? (
              <SettingCardWithCheckBox
                id={item.id}
                key={index}
                title={item.title}
                description={item.description}
                value={item.value}
                onChange={(id: number, value: boolean) => setValue(id, value)}
              />
            ) : (
              <SettingCard
                key={index}
                title={item.title}
                description={item.description}
                onPress={item.changeValue}
              />
            );
          })}
        </View>
      </ScrollView>
      <RadioModal
          title="Установка времени обновления"
          radioValues={updateTimeValues}
          isVisible={showChangeUpdateTimeModal}
          handleClose={() => setShowChangeUpdateTimeModal(false)}
          onPress={(value, _) => onPressUpdateTimeRadio(+value)}
      />
      <RadioModal
          title="Установка времени фиксации положения в геозоне"
          radioValues={updateTimeValues}
          isVisible={showChangeUpdateGeoTimeModal}
          handleClose={() => setShowChangeUpdateGeoTimeModal(false)}
          onPress={(value, _) => onPressUpdateGeoTimeRadio(+value)}
      />
      <RadioModal
          title="Установка радиуса"
          radioValues={radiusValues}
          isVisible={showChangeUpdateRadiusModal}
          handleClose={() => setShowChangeUpdateRadiusModal(false)}
          onPress={(value, _) => onPressUpdateRadius(+value)}
      />
      <RadioModal
          title="Установка количества МЗ"
          radioValues={countOfAttemptValues}
          isVisible={showChangeCountOfAttemptModal}
          handleClose={() => setShowChangeCountOfAttemptModal(false)}
          onPress={(value, _) => onPressUpdateCountOfAttempt(+value)}
      />
      <RadioModal
          title="Установка количества проверок что пользователь не в радиусе"
          radioValues={countOfAttemptForCheckingInRadiusValues}
          isVisible={showChangeCountOfAttemptForCheckingInRadiusModal}
          handleClose={() => setShowChangeCountOfAttemptModal(false)}
          onPress={(value, _) => onPressUpdateCountOfAttemptForCheckingInRadius(+value)}
      />
      <PhoneModal
          title="Номер телефона"
          initialValue={localSettings.commonSettings.phone}
          isVisible={showChangePhoneModal}
          handleClose={() => setShowChangePhoneModal(false)}
          onSubmit={(phone) => handlePhoneChange(phone)}
      />
    </SafeAreaView>
  );
};
