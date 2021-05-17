import Svg, { SvgContext } from './svg/svg';
import { Wheel } from './Wheel';

const life_sectors = ["Money", "Fun", "Friends", "Health", "Career", "Love", "Spirituality", "Family"];

function App() {
  //return <Wheel sectors={life_sectors} grads={10} width={640} height={640} />
  return (
    <Svg
      width={640} height={640}
      innerWidth={240} innerHeight={240}
      render={(ctx: SvgContext) => <Wheel sectors={life_sectors} grads={10} ctx={ctx} />}
    />
  );
}

export default App;
