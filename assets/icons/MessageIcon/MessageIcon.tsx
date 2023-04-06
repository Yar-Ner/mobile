import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type IconPropsType = {
  width: number;
  height: number;
  fill?: string;
};

export const MessageIcon: React.FC<IconPropsType> = ({
  width,
  height,
  fill = 'none',
}) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill={fill}>
    <Path
      d="M6.667 35V13.333a5 5 0 015-5h16.666a5 5 0 015 5v10a5 5 0 01-5 5h-15L6.667 35zM20 18.333v.017M13.333 18.333v.017M26.667 18.333v.017"
      stroke="#fff"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
