import {StyleSheet} from 'react-native';
import {AppColors} from '../../theme';
import Device from "react-native-device-detection";

const CustomHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.Red,
  },
  contentContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    marginLeft: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginLeft: Device.isTablet ? -60 : -15,
  },
  tabsContainerLandscape: {
    marginLeft: Device.isTablet ? 0 : -15,
  },
  hiddenTabsContainer: {
    display: 'none',
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -20,
  },
  iconButton: {
    marginRight: 15,
  },
  iconButtonLandscape: {
    marginRight: 20,
  },
  mapTabButton: {
    marginLeft: '-7%',
  },
});

export default CustomHeaderStyles;
