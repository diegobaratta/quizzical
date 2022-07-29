import React, { useState, Suspense, lazy } from 'react'
import Blob from './components/Blob'
import MainMenu from './components/MainMenu'
const Game = lazy(() => import('./components/Game'));


function App() {

  const [start, setStart] = useState(false)
  
  return (
    <>
      <Blob position='top' />
      <main>
        {
          !start ?
          <MainMenu start={setStart} /> :
          <Suspense fallback={<h1>Loading..</h1>}>  
            <Game />
          </Suspense>
        }        
      </main>
      <Blob position='bottom' />
    </>
  );
}

export default App;
