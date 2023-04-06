import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type IconPropsType = {
  width: number;
  height: number;
  fill?: string;
  rotating?: number;
};

export const AddPhotoIcon: React.FC<IconPropsType> = ({
  width,
  height,
  rotating = 0,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 44 45"
    style={{transform: [{rotate: `${rotating}deg`}]}}
    fill="none">
    <Path
      d="M8.333 16.667H10a3.333 3.333 0 003.333-3.334A1.667 1.667 0 0115 11.667h10a1.667 1.667 0 011.667 1.666A3.334 3.334 0 0030 16.667h1.667A3.333 3.333 0 0135 20v15a3.333 3.333 0 01-3.333 3.333H8.333A3.333 3.333 0 015 35V20a3.333 3.333 0 013.333-3.333"
      stroke="#DBE2F6"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 31.667a5 5 0 100-10 5 5 0 000 10z"
      stroke="#DBE2F6"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      stroke="#DBE2F6"
      strokeWidth={3}
      strokeLinecap="round"
      d="M38.5 1.5L38.5 8.5"
    />
    <Path d="M35 5h7" stroke="#DBE2F6" strokeWidth={3} strokeLinecap="round" />
  </Svg>
);
