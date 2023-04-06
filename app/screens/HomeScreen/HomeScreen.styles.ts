import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';

const HomeScreenStyles = StyleSheet.create({
  SafeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  tabletSideBar: {
    width: '15%',
    backgroundColor: AppColors.Main,
  },
  phoneSideBarContainer: {
    position: "absolute",
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    zIndex: 3,
  },
  phoneSideBar: {
    width: '25%',
    height: '100%',
    backgroundColor: AppColors.Main,
  },
  phoneSideBarOverlay: {
    width: '75%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  hiddenSideBarContainer: {
    position: 'absolute',
    left: 0,
    width: '12%',
    height: '92%',
    zIndex: 2,
  },
  hiddenSideBarContainerMobile: {
    position: 'absolute',
    left: 0,
    width: 0,
    height: '87%',
    zIndex: 2,
  },
  hiddenSideBarContainerLandscape: {
    position: 'absolute',
    left: 0,
    width: '12%',
    height: '85%',
    zIndex: 2,
  },
  hiddenMobileSideBarContainerLandscape: {
    position: 'absolute',
    left: 0,
    width: 0,
    height: '87%',
    zIndex: 2,
  },
  hiddenSideBar: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  hiddenMobileSideBar: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  footer: {
    width: '100%',
    paddingHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: AppColors.White,
  },
  footerLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingHorizontal: 10,
  },
  footerWeightLine: {
    marginBottom: 5,
  },
  weightCarInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightLoadedCarInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightCargoInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  varianceInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  varianceLabel: {
    color: AppColors.Red,
  },
  weightCargoLabel: {
    color: AppColors.ButtonTextColor,
  },
  successModalText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: AppColors.Active,
    ...Fonts.Bold,
    fontSize: 20,
  },
  successModalBody: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.ActiveOpacity,
    borderRadius: 50,
  },
  syncStatusContainer: {
    flexDirection: 'row',
  },
  syncStatusText: {
    color: 'grey',
    ...Fonts.Bold,
  },
  syncStatusTextError: {
    color: AppColors.Red,
    ...Fonts.Bold,
  },
  input: {
    width: '90%',
    paddingBottom: -10,
    textAlign: 'center',
    ...Fonts.Bold,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: AppColors.TaskColor,
    color: AppColors.TaskColor,
  },
  carWeightModalContainer: {
    width: '90%',
    marginLeft: 30,
  },
  assignsLoader: {
    flex: 1,
    backgroundColor: AppColors.White,
  },
});

export default HomeScreenStyles;
