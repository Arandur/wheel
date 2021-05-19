import Wheel, { WheelProps } from './Wheel';

const LifeWheel = (props: Omit<WheelProps, 'sectors'>) => {
    const sectors = ["Money", "Fun", "Friends", "Health", "Career", "Love", "Spirituality", "Family"];
    return <Wheel sectors={sectors} {...props} />;
}

const RelationshipWheel = (props: Omit<WheelProps, 'sectors'>) => {
    const sectors = ["Trust", "Money", "Parenting", "Emotional Connection", "Conflict Resolution", "Recreation", "Intimacy", "Communication"];
    return <Wheel sectors={sectors} {...props} />
}

export {
    Wheel,
    LifeWheel,
    RelationshipWheel
};