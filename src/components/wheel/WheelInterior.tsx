import { css } from '@emotion/css';
import { useContext } from 'react';
import { SvgContext } from '../svg/svg';
import { Sector } from './Sector';

export type WheelInteriorProps = {
    sectors: { [title: string]: number };
    grads: number;
    setSectorValue: (title: string, value: number) => void;
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

const WheelInterior = (props: WheelInteriorProps) => {
  const { sectors: sectorValues, grads, setSectorValue } = props;

  const ctx = useContext(SvgContext);
  const arc = 1 / Object.keys(sectorValues).length;

  /**
   * We want the wheel's radius to be 90% of the size of the svg proper, to
   * leave some room for labels.
   */
  const maxRadius = 0.5 * Math.min(ctx.svgWidth, ctx.svgHeight);
  const wheelRadius = 0.9 * maxRadius;

  /**
   * We calculate the font height relative to the max radius so it'll scale!
   */
  const fontHeight = 0.07 * maxRadius;
  const titleBaselineRadius = 0.95 * maxRadius;

  const makeTitle = (titleText: string) => {
    const degs = arc * 360;
    const rads = arc * 2 * Math.PI;
    const x = titleBaselineRadius * Math.cos(rads);
    const y = titleBaselineRadius * Math.sin(rads);

    const pathSpec = `
            M ${x} ${y}
            A ${titleBaselineRadius} ${titleBaselineRadius} 
              ${degs} 0 1 0 ${titleBaselineRadius}`;
    const pathSpecLength = titleBaselineRadius * rads;
    const textLength = getTextWidth(titleText, `${fontHeight}px sans-serif`);
    const offset = (pathSpecLength - textLength) / 2;

    const pathId = `path-for-${titleText}`;
    const pathElem = (
      <path id={pathId} d={pathSpec} fill='none' stroke='none' />
    );
    // TODO: This is throwing the React stack; figure out why
    //ctx.addDefinition(pathId, <path d={pathSpec} />)

    return (
        <>
          {pathElem}
          <text
            className={css({
              textAlign: "center",
              font: `${fontHeight}px sans-serif`,
            })}
          >
            <textPath xlinkHref={`#${pathId}`} startOffset={offset}>
              {titleText}
            </textPath>
          </text>
        </>
    );
  };

  /**
   * Gonna draw a few circles...
   */
  const circles = [];

  /**
   * ... the exterior circle, which contains all the sectors...
   */
  circles.push(
    <circle
      key="ext"
      className={css({
        fill: "none",
        stroke: "black",
        strokeWidth: 1,
        pointerEvents: "none",
      })}
      cx={0}
      cy={0}
      r={wheelRadius}
    />
  );

  /**
   * ... and the grad circles, to divide the sector cells.
   */
  for (let i = 1; i < grads; ++i) {
    circles.push(
      <circle
        key={`grad${i}`}
        className={css({
          fill: "none",
          stroke: "gray",
          strokeDasharray: "4",
          pointerEvents: "none",
        })}
        cx={0}
        cy={0}
        r={wheelRadius * i / grads}
      />
    );
  }

  /**
   * Now the sectors themselves...
   */
  const sectors = Object.entries(sectorValues).map(([titleText, value], idx) => (
    <g
      key={`sector${idx}`}
      transform={`rotate(${idx * 360 * arc})`}
      pointerEvents="none"
    >
      <Sector
        key={`sector${idx}`}
        arc={arc}
        grads={grads}
        wheelRadius={wheelRadius}
        title={makeTitle(titleText)}
        value={value}
        setValue={(newValue: number) => setSectorValue(titleText, newValue)}
      />
    </g>
  ));

  return (
    <>
      {circles}
      {sectors}
    </>
  );
};

export default WheelInterior;

