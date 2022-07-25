import React, { useEffect, useState } from 'react'
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'

function Game() {

    const [questions, setQuestions] = useState([])    

    async function getQuestions() {

        const resp = await fetch("https://opentdb.com/api.php?amount=10")
        const data = await resp.json()

        setQuestions(data.results)
    }

    useEffect(() => {
        getQuestions()
    }, [])

    return (
        <ol>
            {questions.map(({question, correct_answer, incorrect_answers}) => {
                incorrect_answers.push(correct_answer)

                const answers = {
                    
                }
                
                console.log(incorrect_answers.sort((a, b) => 0.5 - Math.random()));

                //Correct answer added to the incorrects one and then I shuffle the array.
                //const answers = incorrect_answers.push(correct_answer).sort((a, b) => 0.5 - Math.random());

                /*return (
                    <li key={nanoid()}>
                        <h3>{question}</h3>
                        <ul>
                            {answers.map(answer => {
                                return (<li key={nanoid()}>{answer}</li>)
                            })}
                        </ul>
                    </li>
                )*/
            })}
        </ol>
    )
}

export default Game