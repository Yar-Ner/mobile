import {StyleSheet} from 'react-native';
import {AppColors, Fonts} from '../../theme';
import Device from "react-native-device-detection";

const TaskScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  infoContainer: {
    width: '100%',
  },
  taskList: {
    display: 'flex',
  },
  emptyAssignsTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAssignsText: {
    ...Fonts.SemiBold,
    color: AppColors.InactiveButton,
    textAlign: 'center',
  },
  subTasksContainer: {
    marginHorizontal: 8,
  },
  startContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  startText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  completeButtonInActive: {
    position: 'relative',
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: Device.isTablet ? 22 : 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: AppColors.InactiveButton,
  },
  completeButtonActive: {
    position: 'relative',
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.Active,
    paddingVertical: Device.isTablet ? 18 : 12,
    borderRadius: 6,
    borderColor: AppColors.Active,
  },
  completeButtonText: {
    ...Fonts.Bold,
    color: AppColors.InactiveButton,
    fontSize: 18,
  },
  completeButtonTextActive: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: 18,
  },
  completeModalHeader: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  completeModalTitle: {
    ...Fonts.Bold,
    fontSize: 18,
    textAlign: 'left',
  },
  completeModalBody: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  completeModalTextArea: {
    paddingLeft: 15,
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: AppColors.TaskColor,
    textAlignVertical: 'top',
    color: AppColors.TaskColor,
  },
  completeButtonModal: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.Active,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 6,
    elevation: 5,
  },
  completeButtonModalText: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: 16,
  },
  listHeader: {},
  startButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: AppColors.ButtonTextColor,
    paddingVertical: Device.isTablet ? 18 : 12,
    borderRadius: 6,
    borderColor: AppColors.Active,
  },

  startButtonInActive: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: 'transparent',
    paddingVertical: Device.isTablet ? 18 : 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: AppColors.InactiveButton,
  },
  startButtonTextActive: {
    ...Fonts.Bold,
    color: AppColors.White,
    fontSize: 16,
  },
  listFooter: {
    height: 180,
  },
  subTasksContainerHeaderText: {
    ...Fonts.Bold,
    color: AppColors.TaskColor,
    fontSize: 18,
    marginBottom: 16,
    marginTop: 10,
  },
  subTasksContainerHeaderTextMobile: {
    marginBottom: 16,
    marginTop: 10,
    ...Fonts.Bold,
    fontSize: 16,
    color: AppColors.TaskColor,
  },
});
export default TaskScreenStyles;
