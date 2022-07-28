import React, { useEffect, useState } from 'react'
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'

function Game() {

    const [questions, setQuestions] = useState([])    

    async function getQuestions() {

        const resp = await fetch("https://opentdb.com/api.php?amount=1")
        const data = await resp.json()

        const queArr = await data.results.map(({question, correct_answer, incorrect_answers}) => {
                    
            //Craft the array with all the answers
            const answers = incorrect_answers.map(answer => {
                                return ({
                                    id: nanoid(),
                                    answer: answer,
                                    val: false,
                                    userInput: false,
                                })
                            })
    
            answers.push({
                id: nanoid(),
                answer: correct_answer,
                val: true,
                userInput: false,
            })                
            
            //Suffle the array for avoid that the last one always be the correct one 
            answers.sort((a, b) => 0.5 - Math.random())

            return ({
                question: question, 
                answers: answers,                
            })
        })

        setQuestions(queArr)
    }

    useEffect(() => {
        getQuestions()
    }, [])

    function decodeHTMLCode(str){
        return str.replace(/&amp;/g, "&")
                    .replace(/&quot;/g, "'")
                    .replace(/&deg;/g, "°")
                    .replace(/(&#(\d+);)/g, (match, capture, charCode) => 
                        String.fromCharCode(charCode));
    }

    function handleClick(src) {

        switch (src) {
            case 'shuffle':
                getQuestions()
                break;
            case 'check':
                break;
            default:
                break;    
        }
    }

    function selectAnswer(id) {
        
        setQuestions(prevQue => prevQue.map( ({question, answers}) => {
            console.log(question)
            const modAns = answers.map ( oldAnswer => {
                
                return id === oldAnswer.id ? 
                        {
                            ...oldAnswer,
                            userInput: true
                        } :
                        {
                            ...oldAnswer,
                            userInput: false
                        }
            })

            return {
                ...question, 
                answer: modAns,
            }
        }))

    }

    const questionlist = questions.map(({answers, question}) => {

        return (
            <li className='question-group' key={nanoid()}>
                <h3 className='question'>{decodeHTMLCode(question)}</h3>
                <ul className='answer-group'>
                    {answers.map(answer => {
                        return (
                            <li className='answer' key={nanoid()} onClick={() => selectAnswer(answer.id)}>
                                {decodeHTMLCode(answer.answer)}
                            </li>
                        )
                    })}
                </ul>
            </li>
        )
    })

    return (
        <section className='game'>
            <ol>
                {questionlist}
            </ol>
            <div className='game-buttons'>
                <button className='btn' onClick={() => handleClick('shuffle')}>Shuffle Questions</button>
                <button className='btn' onClick={() => handleClick('check')}>Check answers</button>
            </div>
        </section>
    )
}

export default Game