import React, { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'

function Game() {

    const [questions, setQuestions] = useState([])  
    const [result, setResult] = useState({
                                finished: false, 
                                score: 0
                            })  

    async function getQuestions() {

        const resp = await fetch("https://opentdb.com/api.php?amount=5")
        const data = await resp.json()

        const questionsAPI = await data.results.map(({question, correct_answer, incorrect_answers}) => {
                    
            //Craft the array with all the answers
            const answers = incorrect_answers.map(answer => {
                                return ({
                                    id: nanoid(),
                                    text: answer,
                                    val: false,
                                    userInput: false,
                                    bgColor: '#FFF',
                                    fontOpacity: 1,
                                })
                            })
    
            answers.push({
                id: nanoid(),
                text: correct_answer,
                val: true,
                userInput: false,
                bgColor: '#FFF',
                fontOpacity: 1,
            })                
            
            //Suffle the array for avoid that the last one always be the correct one 
            answers.sort((a, b) => 0.5 - Math.random())

            return ({
                id: nanoid(),
                text: question, 
                answers: answers,                
            })
        })

        setQuestions(questionsAPI)
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
                let rightAnswers = 0

                setQuestions(prevQue => prevQue.map( question => {

                    const modAnsw =  question.answers.map(answer => {                       

                        if(answer.val && answer.userInput){
                            rightAnswers++                            
                        }

                        return answer.val ?
                                { 
                                    ...answer,
                                    bgColor: '#94D7A2', //green
                                    fontOpacity: 1,
                                } :
                                !answer.val && answer.userInput ?
                                    { 
                                        ...answer,
                                        bgColor: '#F8BCBC', //red
                                        fontOpacity: 0.5,
                                    } : 
                                    { 
                                        ...answer,
                                        bgColor: '#FFF',
                                        fontOpacity: 0.5,
                                    }
                    })
        
                    return ({
                        ...question,
                        answers: modAnsw
                    })
        
                }))

                questions.forEach(question => {
                    question.answers.forEach( answer => {
                        answer.val && answer.userInput && rightAnswers++                            
                    })
                })

                setResult({
                            finished: true, 
                            score: rightAnswers,
                        })

                break;
            case 'playAgain':
                setResult({
                    finished: false,
                    score: 0,
                })

                getQuestions()

                break;
            default:
                break;    
        }
    }

    function selectAnswer(qId, aId) {       

        setQuestions(prevQue => prevQue.map( question => {

            const modAnsw =  question.answers.map(answer => {
                        return  qId === question.id && aId === answer.id ?
                                {
                                    ...answer, 
                                    userInput: true, 
                                    bgColor: '#D6DBF5'
                                } : 
                                qId === question.id ? 
                                    {
                                        ...answer, 
                                        userInput: false, 
                                        bgColor: '#FFF'
                                    } :
                                    answer
            })

            return ({
                ...question,
                answers: modAnsw
            })

        }))
        
    }
    
    const questionlist = questions.map(({answers, text, id: qId}) => {        
        
        return (
            <li className='question-group' key={qId}>
                <h3 className='question'>{decodeHTMLCode(text)}</h3>
                <ul className='answer-group'>
                    {answers.map(({id: aId, text, bgColor, fontOpacity}) => {        
                        return (
                            <li className='answer' key={aId} onClick={() => selectAnswer(qId, aId)} style={{backgroundColor: bgColor, opacity: fontOpacity}}>
                                {decodeHTMLCode(text)}
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
                {
                    result.finished ?
                        <>
                            <div className='resultText'>You scored {result.score}/{questions.length} correct answers</div>
                            <button className='btn' onClick={() => handleClick('playAgain')}>Play Again</button>
                        </> :
                        <>
                            <button className='btn' onClick={() => handleClick('shuffle')}>Shuffle Questions</button>
                            <button className='btn' onClick={() => handleClick('check')}>Check answers</button>
                        </>
                }
                
                
            </div>
        </section>
    )
}

export default Game