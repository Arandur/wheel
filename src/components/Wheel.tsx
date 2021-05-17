import React from 'react';
import { Sector } from './Sector';
import { createUseStyles } from 'react-jss';
import Svg, { SvgContext } from './svg/svg';

export type WheelProps = {
    sectors: string[];
    grads: number;
    width: number;
    height: number;
}

export const Wheel = (props: WheelProps) => {
    const styles = useStyles();

    const makeSector = (ctx: SvgContext) => (title: string, idx: number) =>
        <g key={title} transform={`rotate(${idx * 360 / props.sectors.length})`}>
            <Sector 
                title={title}
                arc={1 / props.sectors.length}
                grads={props.grads}
                ctx={ctx}
            />
        </g>

    const gradCircles = Array.from(Array(props.grads).keys()).slice(1).map((i) => {
        const radius = i * 100 / props.grads;
        return <circle key={i} className={styles.gradCircles} cx={0} cy={0} r={radius} />
    });

    return (
        <Svg 
            width={props.width} height={props.height} 
            innerWidth={240} innerHeight={240}
            render={(ctx: SvgContext) => [
                props.sectors.map(makeSector(ctx)),
                gradCircles
            ]}
        />
    );
}

const useStyles = createUseStyles({
    gradCircles: {
        fill: "none",
        stroke: "gray",
        strokeDasharray: "4",
        pointerEvents: "none"
    }
});