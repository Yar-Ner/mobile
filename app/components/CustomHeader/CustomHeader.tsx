import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Linking, Animated} from 'react-native';
import CustomHeaderStyles from './CustomHeader.styles';
import {ProfileCard} from '../ProfileCard/ProfileCard';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {AppColors} from '../../theme';
import Svg, {Path} from 'react-native-svg';
import {CallIcon, MessageIcon} from '../../../assets/icons';
import {useScreenDimensions} from '../../hooks/DimensionHook';
import {RootState} from '../../store/store';
import {MessageIconWithNotification} from '../../../assets/icons/MessageIconWithNotification/MessageIconWithNotification';
import Device from "react-native-device-detection";
import {SettingsType} from "../../types";
import {getDriverName} from "../../store/modules/user/actions/userActions";
import {setShowMobileSideBar, updateMessageCounter} from "../../store/modules/ui/actions/uiActions";
import {syncWithServer} from "../../store/modules/sync/actions/syncActions";
import {getTimeWithoutSeconds} from "../../services/sync/sync";

export const CustomHeader: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const carPlate = useSelector<RootState, string | null>(
    state => state.carsState.car.number,
  );
  const driverName = useSelector<RootState, string>(
    state => state.userState.user.fullname,
  );
  const token = useSelector<RootState, string>(state => state.userState.user.token);
  const showMobileSideBar = useSelector<RootState, boolean>(
    state => state.uiState.showMobileSideBar,
  );
  const settings = useSelector<RootState, SettingsType>(
    state => state.settingsState.settings,
  );
  const isSynced = useSelector<RootState, boolean>(
    state => state.syncState.isStartSynced,
  );
  const messageCounter = useSelector<RootState, number>(
    state => state.uiState.messageCounter,
  );
  const [isActiveMapTab, setIsActiveMapTab] = useState(false);
  const [activeTab, setActiveTab] = useState('Список');
  const screenData = useScreenDimensions();
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    dispatch(getDriverName());
  }, [dispatch]);

  useEffect(() => {
    if (!isSynced) {
      rotateAnimation.stopAnimation();
    }
  }, [isSynced, rotateAnimation]);

  useEffect(() => {
    if (activeTab === 'Карта' || props.route.params?.screen === 'MapScreen') {
      setIsActiveMapTab(true);
    } else {
      setIsActiveMapTab(false);
    }
  }, [activeTab, props.route.params?.screen]);

  const handleProfileClick = () => {
    props.navigation.navigate('DriverProfileScreen');
  };

  const openMobileSideBar = () => {
    if (showMobileSideBar) {
      dispatch(setShowMobileSideBar(false));
    } else {
      dispatch(setShowMobileSideBar(true));
    }
  };

  const rotateSyncButton = () => {
    rotateAnimation.setValue(0);
    Animated.loop(
      Animated.spring(rotateAnimation, {
        toValue: 1,
        tension: 5,
        useNativeDriver: true,
      }),
    ).start();
  };

  const handleSyncButton = () => {
    let time = getTimeWithoutSeconds();
    rotateSyncButton();
    dispatch(syncWithServer(time, token));
  };
  const handleCallButton = () => {
    Linking.openURL(`tel:${settings.commonSettings.phone}`);
  };

  const handleChatButton = () => {
    props.navigation.navigate('ChatScreen');
    dispatch(updateMessageCounter(0));
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'Список') {
      props.navigation.navigate('HomeScreen', {screen: 'TaskScreen'});
      setActiveTab('Список');
      return;
    }
    props.navigation.navigate('HomeScreen', {screen: 'MapScreen'});
    setActiveTab('Карта');
  }

  const getTabsStyle = () => {
    if (Device.isTablet) {
      return CustomHeaderStyles.tabsContainer;
    }
    if (screenData.isLandscape && Device.isTablet) {
      return CustomHeaderStyles.tabsContainerLandscape;
    }

    return CustomHeaderStyles.hiddenTabsContainer;
  };

  return (
    <View style={CustomHeaderStyles.container}>
      {!Device.isTablet && (
        <TouchableOpacity
          onPress={() => openMobileSideBar()}
          style={CustomHeaderStyles.menuButton}>
          <Icon name={'menu-outline'} size={30} color={AppColors.White} />
        </TouchableOpacity>
      )}
      <View style={CustomHeaderStyles.contentContainer}>
        <ProfileCard
          onClick={handleProfileClick}
          driverName={driverName}
          carPlate={carPlate}
        />
        <View style={getTabsStyle()}>
          <TouchableOpacity
            onPress={() => handleTabClick('Список')}>
            <Svg
              width={!screenData.isLandscape ? 120 : 150}
              height={56}
              viewBox="0 0 200 56"
              fill="none">
              <Path
                d="M12.639 1.79a1 1 0 01.978-.79h175.146l-11.571 54H2.474a1 1 0 01-.978-1.21l11.143-52z"
                fill={!isActiveMapTab ? '#F25D65' : 'none'}
                stroke="#fff"
                strokeWidth={2}
              />
              <Path
                d="M62.794 36.216c-1.632 0-3.064-.352-4.296-1.056-1.216-.704-2.152-1.712-2.808-3.024-.656-1.312-.984-2.848-.984-4.608 0-1.76.328-3.288.984-4.584.656-1.312 1.592-2.32 2.808-3.024 1.232-.704 2.664-1.056 4.296-1.056 1.056 0 2.048.16 2.976.48a7.554 7.554 0 012.472 1.344c.208.16.352.328.432.504.08.176.12.392.12.648 0 .352-.096.648-.288.888-.192.24-.424.36-.696.36-.32 0-.648-.112-.984-.336-.688-.512-1.328-.864-1.92-1.056a5.905 5.905 0 00-1.968-.312c-1.664 0-2.928.52-3.792 1.56-.848 1.04-1.272 2.568-1.272 4.584 0 2.032.424 3.568 1.272 4.608.864 1.04 2.128 1.56 3.792 1.56.688 0 1.32-.104 1.896-.312.592-.208 1.256-.56 1.992-1.056.16-.096.32-.176.48-.24.16-.064.328-.096.504-.096.272 0 .504.12.696.36.192.24.288.536.288.888 0 .24-.04.456-.12.648-.08.176-.224.344-.432.504a7.918 7.918 0 01-2.472 1.368 9.502 9.502 0 01-2.976.456zm9.858-.072c-.448 0-.808-.128-1.08-.384s-.408-.6-.408-1.032v-8.952c-.016-.464.104-.832.36-1.104.256-.272.608-.408 1.056-.408h8.04c.464-.016.832.104 1.104.36.272.256.408.608.408 1.056v9.048c0 .432-.136.776-.408 1.032-.272.256-.632.384-1.08.384-.464 0-.832-.128-1.104-.384-.272-.256-.408-.6-.408-1.032V26.52h-4.968v8.208c0 .432-.136.776-.408 1.032-.272.256-.64.384-1.104.384zm20.33-10.968c.32-.448.607-.752.863-.912.272-.16.64-.24 1.104-.24.464 0 .832.128 1.104.384.288.256.432.6.432 1.032v9.24c0 .432-.136.784-.408 1.056-.256.272-.592.408-1.008.408-.432 0-.784-.136-1.056-.408-.256-.272-.384-.624-.384-1.056v-6.768l-5.088 7.128c-.304.432-.6.728-.888.888-.272.144-.616.216-1.032.216-.464 0-.832-.128-1.104-.384-.272-.256-.408-.608-.408-1.056v-9.24c0-.432.128-.776.384-1.032.272-.272.624-.408 1.056-.408.416 0 .752.136 1.008.408.272.256.408.6.408 1.032v6.72l5.016-7.008zm11.751 11.016c-1.168 0-2.2-.248-3.096-.744a5.093 5.093 0 01-2.04-2.112c-.48-.912-.72-1.976-.72-3.192 0-1.216.248-2.288.744-3.216a5.402 5.402 0 012.136-2.184c.912-.512 1.96-.768 3.144-.768.624 0 1.248.088 1.872.264.64.176 1.2.416 1.68.72.512.336.768.76.768 1.272 0 .352-.088.64-.264.864a.775.775 0 01-.648.312c-.176 0-.36-.04-.552-.12a4.834 4.834 0 01-.576-.288 5.7 5.7 0 00-1.008-.48 2.956 2.956 0 00-1.104-.192c-.992 0-1.76.328-2.304.984-.528.64-.792 1.568-.792 2.784 0 1.2.264 2.128.792 2.784.544.64 1.312.96 2.304.96.4 0 .752-.056 1.056-.168.32-.128.672-.296 1.056-.504a3.75 3.75 0 01.624-.312c.176-.08.352-.12.528-.12.256 0 .472.112.648.336.176.224.264.504.264.84 0 .272-.064.512-.192.72-.112.192-.304.368-.576.528a6.576 6.576 0 01-1.728.768 7.746 7.746 0 01-2.016.264zm11.863 0c-1.2 0-2.256-.248-3.168-.744a5.168 5.168 0 01-2.088-2.136c-.496-.928-.744-2.008-.744-3.24 0-1.232.248-2.304.744-3.216a5.168 5.168 0 012.088-2.136c.912-.496 1.968-.744 3.168-.744 1.2 0 2.248.248 3.144.744a4.983 4.983 0 012.088 2.136c.496.912.744 1.984.744 3.216 0 1.232-.248 2.312-.744 3.24a4.983 4.983 0 01-2.088 2.136c-.896.496-1.944.744-3.144.744zm-.024-2.328c.976 0 1.72-.32 2.232-.96.512-.64.768-1.584.768-2.832 0-1.232-.256-2.168-.768-2.808-.512-.656-1.248-.984-2.208-.984-.96 0-1.704.328-2.232.984-.512.64-.768 1.576-.768 2.808 0 1.248.256 2.192.768 2.832.512.64 1.248.96 2.208.96zm15.34-4.296c.56.208 1.008.488 1.344.84.352.352.76.944 1.224 1.776l1.056 1.824c.144.256.216.504.216.744 0 .384-.152.712-.456.984a1.5 1.5 0 01-1.032.384c-.544 0-.96-.256-1.248-.768l-1.512-2.688c-.336-.56-.664-.952-.984-1.176-.32-.224-.784-.336-1.392-.336h-.936v3.552c0 .448-.136.8-.408 1.056-.272.256-.64.384-1.104.384-.464 0-.832-.128-1.104-.384-.256-.256-.384-.608-.384-1.056V25.44c0-.432.136-.776.408-1.032.272-.256.632-.384 1.08-.384.464 0 .832.128 1.104.384.272.256.408.6.408 1.032v3.48h1.08l3.432-4.272c.32-.416.696-.624 1.128-.624.336 0 .624.12.864.36s.36.528.36.864c0 .336-.128.664-.384.984l-2.76 3.336z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabClick('Карта')}
            style={CustomHeaderStyles.mapTabButton}>
            <Svg
              width={!screenData.isLandscape ? 120 : 150}
              height={56}
              viewBox="0 0 200 56"
              fill="none">
              <Path
                d="M1.237 55L12.808 1h174.718a1 1 0 01.978 1.21l-11.143 52a1 1 0 01-.978.79H1.237z"
                fill={isActiveMapTab ? '#F25D65' : 'none'}
                stroke="#fff"
                strokeWidth={2}
              />
              <Path
                d="M64.363 36.144c-.464 0-.832-.136-1.104-.408-.272-.288-.408-.672-.408-1.152V20.472c0-.464.136-.832.408-1.104.288-.288.656-.432 1.104-.432.464 0 .832.144 1.104.432.288.272.432.64.432 1.104v5.688h2.064l5.376-6.624c.32-.384.696-.576 1.128-.576.352 0 .656.128.912.384.272.256.408.56.408.912 0 .336-.12.648-.36.936l-4.56 5.544c.576.208 1.04.448 1.392.72.368.272.696.616.984 1.032.304.416.696 1.04 1.176 1.872l1.944 3.48c.16.272.24.552.24.84 0 .4-.152.744-.456 1.032a1.422 1.422 0 01-1.008.408c-.528 0-.952-.28-1.272-.84l-2.448-4.368c-.464-.832-.928-1.416-1.392-1.752-.464-.336-1.136-.504-2.016-.504H65.9v5.928c0 .464-.144.84-.432 1.128-.272.288-.64.432-1.104.432zm19.719-12.168c1.632 0 2.84.408 3.624 1.224.8.8 1.2 2.024 1.2 3.672v5.856c0 .432-.128.776-.384 1.032-.256.24-.608.36-1.056.36-.416 0-.76-.128-1.032-.384-.256-.256-.384-.592-.384-1.008V34.2a3.114 3.114 0 01-1.296 1.464c-.576.352-1.248.528-2.016.528-.784 0-1.496-.16-2.136-.48a3.8 3.8 0 01-1.512-1.32 3.335 3.335 0 01-.552-1.872c0-.864.216-1.544.648-2.04.448-.496 1.168-.856 2.16-1.08.992-.224 2.36-.336 4.104-.336h.6v-.552c0-.784-.168-1.352-.504-1.704-.336-.368-.88-.552-1.632-.552-.464 0-.936.072-1.416.216-.48.128-1.048.32-1.704.576-.416.208-.72.312-.912.312a.94.94 0 01-.72-.312c-.176-.208-.264-.48-.264-.816 0-.272.064-.504.192-.696.144-.208.376-.4.696-.576.56-.304 1.224-.544 1.992-.72a10.5 10.5 0 012.304-.264zm-.744 10.056c.8 0 1.448-.264 1.944-.792.512-.544.768-1.24.768-2.088v-.504h-.432c-1.072 0-1.904.048-2.496.144-.592.096-1.016.264-1.272.504s-.384.568-.384.984c0 .512.176.936.528 1.272.368.32.816.48 1.344.48zm15.36-10.056c1.009 0 1.905.256 2.689.768.8.512 1.416 1.24 1.848 2.184.448.928.672 2 .672 3.216 0 1.216-.224 2.28-.672 3.192-.432.912-1.04 1.616-1.824 2.112s-1.689.744-2.713.744c-.831 0-1.575-.176-2.231-.528a3.705 3.705 0 01-1.513-1.464v4.896c0 .416-.135.744-.407.984-.272.24-.632.36-1.08.36-.448 0-.817-.128-1.105-.384-.271-.256-.407-.592-.407-1.008V25.44c0-.432.127-.776.383-1.032.273-.256.633-.384 1.08-.384.448 0 .808.128 1.08.384s.408.6.408 1.032v.6a3.626 3.626 0 011.512-1.512c.672-.368 1.432-.552 2.28-.552zm-.791 9.888c.944 0 1.68-.32 2.208-.96.528-.656.792-1.576.792-2.76 0-1.216-.264-2.16-.792-2.832-.528-.672-1.264-1.008-2.209-1.008-.96 0-1.704.328-2.232.984-.512.656-.768 1.592-.768 2.808 0 1.2.256 2.128.768 2.784.528.656 1.272.984 2.232.984zm12.567 2.28c-.464 0-.832-.128-1.104-.384-.272-.256-.408-.6-.408-1.032V26.52h-2.76c-.352 0-.64-.104-.864-.312-.208-.208-.312-.48-.312-.816 0-.336.104-.608.312-.816.224-.208.512-.312.864-.312h8.52c.352 0 .632.104.84.312.224.208.336.48.336.816 0 .336-.112.608-.336.816-.208.208-.488.312-.84.312h-2.76v8.208c0 .432-.136.776-.408 1.032-.272.256-.632.384-1.08.384zm12.186-12.168c1.632 0 2.84.408 3.624 1.224.8.8 1.2 2.024 1.2 3.672v5.856c0 .432-.128.776-.384 1.032-.256.24-.608.36-1.056.36-.416 0-.76-.128-1.032-.384-.256-.256-.384-.592-.384-1.008V34.2a3.114 3.114 0 01-1.296 1.464c-.576.352-1.248.528-2.016.528-.784 0-1.496-.16-2.136-.48a3.8 3.8 0 01-1.512-1.32 3.335 3.335 0 01-.552-1.872c0-.864.216-1.544.648-2.04.448-.496 1.168-.856 2.16-1.08.992-.224 2.36-.336 4.104-.336h.6v-.552c0-.784-.168-1.352-.504-1.704-.336-.368-.88-.552-1.632-.552-.464 0-.936.072-1.416.216-.48.128-1.048.32-1.704.576-.416.208-.72.312-.912.312a.94.94 0 01-.72-.312c-.176-.208-.264-.48-.264-.816 0-.272.064-.504.192-.696.144-.208.376-.4.696-.576.56-.304 1.224-.544 1.992-.72a10.5 10.5 0 012.304-.264zm-.744 10.056c.8 0 1.448-.264 1.944-.792.512-.544.768-1.24.768-2.088v-.504h-.432c-1.072 0-1.904.048-2.496.144-.592.096-1.016.264-1.272.504s-.384.568-.384.984c0 .512.176.936.528 1.272.368.32.816.48 1.344.48z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        <View style={CustomHeaderStyles.rightButtonsContainer}>
          <TouchableOpacity
            onPress={() => handleCallButton()}
            style={CustomHeaderStyles.iconButton}>
            <CallIcon
              width={!screenData.isLandscape ? 25 : 30}
              height={!screenData.isLandscape ? 25 : 30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleChatButton()}
            style={CustomHeaderStyles.iconButton}>
            {messageCounter > 0 ? (
              <MessageIconWithNotification
                width={!screenData.isLandscape ? 35 : 30}
                height={!screenData.isLandscape ? 35 : 30}
                fill={AppColors.White}
              />
            ) : (
              <MessageIcon
                width={!screenData.isLandscape ? 25 : 30}
                height={!screenData.isLandscape ? 25 : 30}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSyncButton()}
            style={[CustomHeaderStyles.iconButton, {}]}>
            <Animated.Image
              style={{
                width: !screenData.isLandscape ? 25 : 30,
                height: !screenData.isLandscape ? 25 : 30,
                transform: [{rotate: spin}],
              }}
              source={require('../../../assets/images/reload_icon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
