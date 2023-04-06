import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

export const TrafficLightIcon: React.FC = () => (
    <Svg
        width={30}
        height={30}
        viewBox="0 0 24 24"
    >
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.25 12c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10z"
            fill="#CCC"
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.25 12c0 5.523 4.477 10 10 10s10-4.477 10-10-4.477-10-10-10-10 4.477-10 10zm18.333 0a8.333 8.333 0 11-16.666 0 8.333 8.333 0 0116.666 0z"
            fill="#4D4D4D"
        />
        <Path
            d="M9.75 2h2.5c5.514 0 10 4.486 10 10a5.605 5.605 0 01-3.976-1.65c-1.018-1.018-1.68-2.104-3.22-3.906-1.36-1.587-3.236-3.194-5.304-3.194-4.136 0-7.5 3.926-7.5 8.75C1.456 11.059 1 10.005 1 8.875 1 5.085 3.547 2 9.75 2z"
            fill="#4D4D4D"
        />
    </Svg>
);
