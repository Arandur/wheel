import React from 'react';
import { Sector } from './Sector';

export type WheelProps = {
    sectors: string[];
    width: number;
    height: number;
}

const getMousePos = Object.assign(
    (e: React.MouseEvent<SVGElement>): SVGPoint => {
        const svg = getMousePos.svg || (getMousePos.svg = document.getElementById('rootSVG') as SVGSVGElement & HTMLElement);
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM()?.inverse());
    },
    { svg: undefined as SVGSVGElement | undefined }
);

export const Wheel = (props: WheelProps) => {
    const makeSector = (title: string, idx: number) =>
        <g key={title}transform={`rotate(${idx * 360 / props.sectors.length})`}>
            <Sector 
                title={title}
                arc={1 / props.sectors.length}
                getMousePos={getMousePos}
            />
        </g>

    return (
        <svg id="rootSVG" viewBox="-120 -120 240 240" width={props.width} height={props.height}>
            {props.sectors.map(makeSector)}
        </svg>
    );
}