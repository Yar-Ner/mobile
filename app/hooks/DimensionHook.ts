import {useLayoutEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export const useScreenDimensions = () => {
  const [screenData, setScreenData] = useState(Dimensions.get('screen'));

  useLayoutEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.screen);
    };

    const event = Dimensions.addEventListener('change', onChange);

    return () => event.remove();
  });

  return {
    ...screenData,
    isLandscape: screenData.width > screenData.height,
  };
};
