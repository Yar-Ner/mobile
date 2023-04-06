import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type IconPropsType = {
  width: number;
  height: number;
  fill?: string;
  rotating?: number;
};

export const ArrowIcon: React.FC<IconPropsType> = ({
  width,
  height,
  fill,
  rotating = 0,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    style={{transform: [{rotate: `${rotating}deg`}]}}
    fill="none">
    <Path
      d="M18.586 11c.89 0 1.337-1.077.707-1.707l-6.586-6.586a1 1 0 00-1.414 0L4.707 9.293c-.63.63-.184 1.707.707 1.707h2.468a1 1 0 011 1v7a1 1 0 001 1h4.236a1 1 0 001-1v-7a1 1 0 011-1h2.468z"
      fill={fill}
    />
  </Svg>
);
