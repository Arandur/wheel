import React, { useState, useEffect } from 'react';
import Svg from '../svg/svg';
import WheelInterior from './WheelInterior';

export type WheelProps = {
    sectors: string[];
    grads: number;
} & React.SVGProps<SVGSVGElement>;

const useScreenDimensions = () => {
    const [ screenDimensions, setScreenDimensions ] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => setScreenDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })

        window.addEventListener('resize', handleResize);

        handleResize();

        return() => window.removeEventListener('resize', handleResize);
    }, []);

    return screenDimensions;
};

const Wheel = (props: WheelProps) => {
    const { sectors, grads, ...svgProps } = props;

    /**
     * The wheel needs to know, at any point, the value of all of its
     * sectors.
     */
    const [ sectorValues, setSectorValues ] = useState(() => sectors.reduce(
        (state, title) => Object.assign(state, { [title]: 0 }), 
        {} as { [title: string]: number }
    ));

    const setSectorValue = (title: string, value: number) => 
        setSectorValues(oldValue => ({ ...oldValue, ...{ [title]: value }}));

    const screenDimensions = useScreenDimensions();
    const wheelSize = Math.min(screenDimensions.width, screenDimensions.height);

    return (
        <Svg 
            width={wheelSize} height={wheelSize}
            innerWidth={2000} innerHeight={2000}
            {...svgProps}
        >
            <WheelInterior 
                sectors={sectorValues} setSectorValue={setSectorValue} 
                grads={grads} 
            />
        </Svg>
    )
}

export default Wheel;