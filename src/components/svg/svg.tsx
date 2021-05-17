import React from 'react';

export type SvgContext = {
    withMousePos: <T>(cbk: (pt: { x: number, y: number }) => T) => (e: React.MouseEvent<SVGElement>) => T | undefined;
}

type SvgProps = {
    innerWidth: number;
    innerHeight: number;
    render: (ctx: SvgContext) => React.ReactNode;
} & React.SVGProps<SVGSVGElement>;

const Svg = (props: SvgProps) => {
    const { innerWidth, innerHeight, render, ...rest } = props;
    const viewBox = [
        -innerWidth / 2, -innerHeight / 2,
        innerWidth, innerHeight
    ].join(' ');

    const ref = React.createRef<SVGSVGElement>();

    const withMousePos = <T extends {}>(cbk: (pt: { x: number, y: number }) => T) =>
        (e: React.MouseEvent<SVGElement>) => {
            const svg = ref.current;
            if (svg) {
                let pt = svg.createSVGPoint();
                pt.x = e.clientX; pt.y = e.clientY;
                pt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
                return cbk(pt);
            }
        }

    const ctx: SvgContext = {
        withMousePos
    };

    return (
        <svg ref={ref} viewBox={viewBox} {...rest}>
            {render(ctx)}
        </svg>
    );
}

export default Svg;