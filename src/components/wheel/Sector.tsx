import { css } from '@emotion/css';
import React, { useState, useContext } from 'react';
import { SvgContext } from '../svg/svg';

export type SectorProps = {
    arc: number; // Size of the arc as a fraction of tau
    grads: number; // Number of gradients for each sector
    wheelRadius: number; // Radius of the containing wheel
    title: React.ReactNode;
    value: number;
    setValue: (value: number) => void;
}

export const Sector = (props: SectorProps) => {
  const { arc, grads, wheelRadius, title, value, setValue } = props;
  const [ hover, setHover ] = useState(undefined as number | undefined);

  const ctx = useContext(SvgContext);

  const sectorPathSpec = (radius: number) => {
    const rads = arc * 2 * Math.PI;
    const x = radius * Math.cos(rads);
    const y = radius * Math.sin(rads);
    return `M 0 0 L 0 ${radius} A ${radius} ${radius} 0 0 0 ${x} ${y}`;
  }

  const onClick = ctx.withMousePos(pt => {
    const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    const newValue = Math.ceil(dist * grads / wheelRadius);
    
    if (newValue === value) {
      setValue(0);
    } else {
      setValue(newValue);
    }
  });

  const onHover = ctx.withMousePos(pt => {
    const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    setHover(Math.min(Math.ceil(dist * grads / wheelRadius), grads));
  })

  const onLeave = () => setHover(undefined);

  /**
   * Create the sector itself
   */
  const sector = (
    <path
        d={sectorPathSpec(wheelRadius)}
        className={css({
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 1,
          pointerEvents: 'fill'
        })}
        onMouseDown={onClick}
        onMouseMove={onHover}
        onMouseLeave={onLeave}
    />
  );

  const sectorValue = (
    <path
      d={sectorPathSpec(wheelRadius * value / grads)}
      className={css({
        fill: 'rgb(255, 0, 0)',
        stroke: 'none',
        pointerEvents: 'none'
      })}
    />
  );

  const sectorHover = hover !== undefined
    ? (
        <path 
          d={sectorPathSpec(wheelRadius * hover / grads)}
          className={css({
            fill: 'rgb(255, 128, 128)',
            stroke: 'none',
            pointerEvents: 'none'
          })}
        />
      )
    : null;

  const sectorFill = (hover !== undefined && hover < value)
    ? <> {sectorValue} {sectorHover} </>
    : <> {sectorHover} {sectorValue} </>;

  return (
    <>
      {title}
      {sector}
      {sectorFill}
    </>
  );
};