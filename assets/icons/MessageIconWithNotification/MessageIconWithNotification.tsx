import * as React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

type IconPropsType = {
  width: number;
  height: number;
  fill?: string;
};

export const MessageIconWithNotification: React.FC<IconPropsType> = ({
  width,
  height,
  fill = 'none',
}) => (
  <Svg width={width} height={height} viewBox="0 5 60 60">
    <Path
      d="M22.667 51V29.333a5 5 0 015-5h16.666a5 5 0 015 5v10a5 5 0 01-5 5h-15L22.667 51zM36 34.333v.017M29.333 34.333v.017M42.667 34.333v.017"
      stroke="#fff"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={56} cy={16} r={4} fill={fill} />
  </Svg>
);
