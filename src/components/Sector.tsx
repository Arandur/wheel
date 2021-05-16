import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

export type SectorProps = {
    title: string;
    arc: number; // Size of the arc as a fraction of tau
    grads: number; // Number of gradients for each sector
    withMousePos: <T>(cbk: (pt: { x: number, y: number }) => T) => 
        (e: React.MouseEvent<SVGElement>) => T | undefined;
}

const getTextWidth = Object.assign(
    (text: string, font: string): number => {
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
        const ctx = canvas.getContext('2d')!!;
        ctx.font = font;
        const metrics = ctx.measureText(text);
        return metrics.width;
    },
    { canvas: undefined as HTMLCanvasElement | undefined}
);

export const Sector = (props: SectorProps) => {
    let [score, setScore] = useState(0);
    let [hover, setHover] = useState<number | undefined>(undefined);
    let styles = useStyles();

    const getScoreFromMousePos = props.withMousePos(
        (pt: { x: number, y: number }): number => 
            Math.ceil(Math.sqrt(pt.x * pt.x + pt.y * pt.y) / 10)
    );

    const sectorPath = (level: number): string => {
        const radius = level * 10;
        const degs = props.arc * 360;
        const rads = props.arc * 2 * Math.PI;
        const x = radius * Math.cos(rads);
        const y = radius * Math.sin(rads);

        return `
            M 0 0
            L ${radius} 0
            A ${radius} ${radius} ${degs} 0 1 ${x} ${y}
            Z
        `
    };

    const title = (() => {
        const radius = 105;
        const degs = props.arc * 360;
        const rads = props.arc * 2 * Math.PI;
        const x = 110 * Math.cos(rads);
        const y = radius * Math.sin(rads);
        const textPathLength = radius * rads;
        const textLength = getTextWidth(props.title, '12px sans-serif')
        const offset = (textPathLength - textLength) / 2;

        return (
            <>
                <path id="title" key="title" className={styles.titlePath} d={`M ${radius} 0 A ${radius} ${radius} ${degs} 0 1 ${x} ${y}`} />
                <text className={styles.title}>
                    <textPath xlinkHref="#title" startOffset={offset}>{props.title}</textPath>
                </text>
            </>
        );
    })();

    const onMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
        const radius = getScoreFromMousePos(e);

        if (radius !== hover) {
            setHover(radius);
        }
    }

    const onMouseLeave = () => setHover(undefined);

    const onMouseClick = (e: React.MouseEvent<SVGPathElement>) => {
        const radius = getScoreFromMousePos(e);

        if (radius && radius !== score) {
            setScore(radius);
        } else {
            setScore(0);
        }
    }

    const paths = () => {
        const scoreSector = <path key="score" className={styles.sectorFill} d={sectorPath(score)} />;

        if (hover) {
            const hoverSector = <path key="hover" className={styles.sectorHover} d={sectorPath(hover)} />;

            // Order matters: later elements will be drawn over earlier ones.
            if (hover < score) {
                return [scoreSector, hoverSector]
            } else {
                return [hoverSector, scoreSector]
            }
        } else {
            return [scoreSector];
        }
    }

    return (
        <>
            {paths()}
            <path 
                className={styles.sectorContainer} 
                d={sectorPath(10)} 
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseClick} />
            {title}
        </>
    );
}

const useStyles = createUseStyles(
    {
        sectorContainer: {
            fill: "transparent",
            stroke: "black",
            strokeWidth: 1,
            pointerEvents: "fill"
        },
        sectorHover: {
            fill: "rgba(255, 128, 128)",
            stroke: "none"
        },
        sectorFill: {
            fill: "rgb(255, 0, 0)",
            stroke: "none"
        },
        titlePath: {
            fill: "transparent"
        },
        title: {
            textAlign: "center",
            font: "12px sans-serif"
        }
    }
);