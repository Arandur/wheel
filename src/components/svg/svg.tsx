import React, { useState } from 'react';

export type SvgContextValue = {
    svgWidth: number;
    svgHeight: number;
    withMousePos: <T>(cbk: (pt: { x: number, y: number }) => T) =>
        (e: React.MouseEvent<SVGElement>) => T;
    addDefinition: (id: string, definition: JSX.Element) => void;
}

export const SvgContext = React.createContext<SvgContextValue>({
    svgWidth: 0,
    svgHeight: 0,
    withMousePos: <T extends {}>(cbk: (pt: { x: number, y: number }) => T) =>
        (e) => cbk({ x: e.clientX, y: e.clientY }),
    addDefinition: (_id, _definition) => {}
})

type SvgProps = {
    innerWidth: number;
    innerHeight: number;
} & React.SVGProps<SVGSVGElement>;

const Svg = (props: SvgProps) => {
    const { innerWidth, innerHeight, children, ...rest } = props;
    const viewBox = [
        -innerWidth / 2, -innerHeight / 2,
        innerWidth, innerHeight
    ].join(' ');

    const ref = React.createRef<SVGSVGElement>();

    const withMousePos = <T extends {}>(cbk: (pt: { x: number, y: number }) => T) =>
        (e: React.MouseEvent<SVGElement>) => {
            const svg = ref.current!!;
            let pt = svg.createSVGPoint();
            pt.x = e.clientX; pt.y = e.clientY;
            pt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
            return cbk(pt);
        }

    const [ definitions, setDefinitions ] = useState({} as { [id: string]: JSX.Element });
    const addDefinition = (id: string, def: JSX.Element) => 
        setDefinitions(oldState => ({ ...oldState, ...{ [id]: def }}));

    const ctx = {
        svgWidth: innerWidth, 
        svgHeight: innerHeight,
        withMousePos,
        addDefinition
    };

    const defs = (
        <defs>
            {Object.entries(definitions).map(([id, element], idx) => (
                <g key={`def-${id}`} id={id}>
                    {element}
                </g>
            ))}
        </defs>
    );

    return (
        <SvgContext.Provider value={ctx}>
            <svg ref={ref} viewBox={viewBox} {...rest}>
                {defs}
                {children}
            </svg>
        </SvgContext.Provider>
    );
}

export default Svg;