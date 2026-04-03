import { useEffect, useState } from 'react';
import './App.css'

import { Scene } from './experience/scene';
import { ContentPanel } from './content/contentPanel';
import { Tooltip } from 'react-tooltip';
import HanumanFlightGame from './content/HanumanFlightGame';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#game') {
    return <HanumanFlightGame onClose={() => { window.location.hash = '#'; }} />;
  }

  return (
    <>

   <Scene></Scene>
   <ContentPanel></ContentPanel>
     <Tooltip id="globalTooltip" className='global-tooltip custom-tooltip'></Tooltip>
    </>

  )
}

export default App
