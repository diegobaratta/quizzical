import React from 'react'

export default function MainMenu(props) {

    function handleStart(){
        props.start(prevStart => !prevStart)
    }

    return (
        <>
            <h1 className='main--title'>Quizzical</h1>
            <h3 className='main--subtext'>Your friendly trivia game</h3>
            <button className='btn' onClick={handleStart}>Start quiz</button>
        </>
    )
}