import React from 'react';
import { Sector } from './Sector';
import { createUseStyles } from 'react-jss';
import { SvgContext } from './svg/svg';

export type WheelProps = {
    sectors: string[];
    grads: number;
    ctx: SvgContext;
}

export const Wheel = (props: WheelProps) => {
    const styles = useStyles();

    let maxRadius = Math.min(props.ctx.innerHeight, props.ctx.innerWidth) / 2 * 5 / 6;
    const levelToRadius = (level: number): number => maxRadius * level / props.grads;

    const makeSector = (title: string, idx: number) =>
        <g key={title} transform={`rotate(${idx * 360 / props.sectors.length})`}>
            <Sector 
                title={title}
                arc={1 / props.sectors.length}
                grads={props.grads}
                ctx={props.ctx}
            />
        </g>

    const gradCircles = Array.from(Array(props.grads).keys()).slice(1).map((i) => {
        const radius = levelToRadius(i);
        return <circle key={i} className={styles.gradCircles} cx={0} cy={0} r={radius} />
    });

    return (
        <>
          {props.sectors.map(makeSector)}
          {gradCircles}
        </>
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