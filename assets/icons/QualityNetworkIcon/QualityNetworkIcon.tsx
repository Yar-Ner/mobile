import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

type IconPropsType = {
  width: number;
  height: number;
  fill?: string;
  signal: number;
};

export const QualityNetworkIcon: React.FC<IconPropsType> = ({
  width,
  height,
  fill = 'none',
  signal,
}) => {
  const getSignalView = () => {
    switch (signal) {
      case 1:
        return (
          <Svg width={width} height={height} viewBox="0 0 51 24" fill={fill}>
            <Path
              d="M12 14a3 3 0 100-6 3 3 0 000 6z"
              stroke="#DA2A34"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0v0z"
              stroke="#DA2A34"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Rect
              x={24}
              y={19.5}
              width={3}
              height={4.5}
              rx={1}
              fill="#DA2A34"
            />
          </Svg>
        );
      case 2:
        return (
          <Svg width={width} height={height} viewBox="0 0 51 24" fill={fill}>
            <Path
              d="M12 14a3 3 0 100-6 3 3 0 000 6z"
              stroke="#F4A100"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0v0z"
              stroke="#F4A100"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Rect
              x={24}
              y={19.5}
              width={3}
              height={4.5}
              rx={1}
              fill="#F4A100"
            />
            <Rect x={30} y={15} width={3} height={9} rx={1} fill="#F4A100" />
            <Rect
              x={36}
              y={10.5}
              width={3}
              height={13.5}
              rx={1}
              fill="#F4A100"
            />
          </Svg>
        );
      case 3:
        return (
          <Svg width={width} height={height} viewBox="0 0 51 24" fill={fill}>
            <Path
              d="M12 14a3 3 0 100-6 3 3 0 000 6z"
              stroke="#3AB427"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0v0z"
              stroke="#3AB427"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Rect
              x={24}
              y={19.5}
              width={3}
              height={4.5}
              rx={1}
              fill="#3AB427"
            />
            <Rect x={30} y={15} width={3} height={9} rx={1} fill="#3AB427" />
            <Rect
              x={36}
              y={10.5}
              width={3}
              height={13.5}
              rx={1}
              fill="#3AB427"
            />
            <Rect
              x={42}
              y={7.5}
              width={3}
              height={16.5}
              rx={1}
              fill="#3AB427"
            />
            <Rect x={48} y={3} width={3} height={21} rx={1} fill="#3AB427" />
          </Svg>
        );
      default:
        return null;
    }
  };
  return getSignalView();
};
