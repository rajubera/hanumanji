import './App.css'

import { Scene } from './experience/scene';
import { ContentPanel } from './content/contentPanel';
import { Tooltip } from 'react-tooltip';

function App() {
  return (
    <>

   <Scene></Scene>
   <ContentPanel></ContentPanel>
     <Tooltip id="globalTooltip" className='global-tooltip custom-tooltip'></Tooltip>
    </>

  )
}

export default App
