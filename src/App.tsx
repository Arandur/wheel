import { Wheel } from './Wheel';

const life_sectors = ["Money", "Fun", "Friends", "Health", "Career", "Love", "Spirituality", "Family"];

function App() {
  return <Wheel sectors={life_sectors} width={640} height={640} />
}

export default App;
