import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type IconPropsType = {
  width: number;
  height: number;
  fill?: string;
};

export const CallIcon: React.FC<IconPropsType> = ({
  width,
  height,
  fill = 'none',
}) => (
  <Svg width={width} height={height} viewBox="0 0 40 40" fill={fill}>
    <Path
      d="M8.333 6.667H15L18.333 15l-4.166 2.5a18.333 18.333 0 008.333 8.333l2.5-4.166L33.333 25v6.667A3.334 3.334 0 0130 35 26.667 26.667 0 015 10a3.333 3.333 0 013.333-3.333"
      stroke="#fff"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
