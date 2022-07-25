import React, { useState } from 'react'
import Blob from './components/Blob'
import MainMenu from './components/MainMenu'
import Game from './components/Game'

function App() {

  const [start, setStart] = useState(false)
  
  return (
    <>
      <Blob position='top' />
      <main>
        {
          !start ?
          <MainMenu start={setStart} /> :
          <Game />
        }        
      </main>
      <Blob position='bottom' />
    </>
  );
}

export default App;
