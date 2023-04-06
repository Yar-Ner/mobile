import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import CarCardStyles from './CarCard.styles';
import DeviceInfo from 'react-native-device-info';
import Device from 'react-native-device-detection';
import ScalableText from 'react-native-text';
import {Car, ResponseContainerType} from "../../types";

type CarCardProps = {
  id: number;
  carName: string;
  carPlate: string;
  carPhoto?: string | '';
  onSelect: Function;
  carWeight: number;
  color: string;
  type: number | null;
  containers?: Array<ResponseContainerType>
};

export const CarCard: React.FC<CarCardProps> = ({
  carName,
  carPlate,
  onSelect,
  id,
  carWeight,
  color,
  type,
  containers
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pathToCarPhoto] = useState(
    require('../../../assets/images/car.jpeg'),
  );

  const SelectValue = (value: Car, carPhoto: any) => {
    onSelect(value, carPhoto);
  };

  const car = {
    id: id,
    name: carName,
    number: carPlate,
    weight: carWeight,
    color: color,
    type: type,
    containers: containers !== undefined ? containers : [],
  };

  const getCarInfoView = () => {
    if (Device.isTablet && !DeviceInfo.isLandscapeSync()) {
      return (
        <View style={CarCardStyles.carInfo}>
          <ScalableText style={CarCardStyles.carInfoCarNamePortrait}>
            {carName}
          </ScalableText>
          <View>
            <ScalableText style={CarCardStyles.carInfoCarPlatePortrait}>
              {carPlate}
            </ScalableText>
          </View>
        </View>
      );
    } else if (Device.isTablet && DeviceInfo.isLandscapeSync()) {
      return (
        <View style={CarCardStyles.carInfo}>
          <Text style={CarCardStyles.carInfoCarName}>{carName}</Text>
          <View>
            <Text style={CarCardStyles.carInfoCarPlate}>{carPlate}</Text>
          </View>
        </View>
      );
    } else if (!Device.isTablet) {
      return (
        <View style={CarCardStyles.carInfoPhones}>
          <View>
            <Text style={CarCardStyles.carInfoCarPlatePhones}>{carPlate}</Text>
          </View>
          <Text style={CarCardStyles.carInfoCarNamePhones}>{carName}</Text>
        </View>
      );
    }
  };

  // @ts-ignore
  return (
    <TouchableOpacity onPress={() => SelectValue(car, pathToCarPhoto)}>
      <View style={CarCardStyles.container}>
        <Image
          style={
            Device.isTablet ? CarCardStyles.image : CarCardStyles.phoneImage
          }
          source={pathToCarPhoto}
          width={Device.isTablet ? 190 : 140}
          height={104}
        />
        {getCarInfoView()}
      </View>
    </TouchableOpacity>
  );
};
