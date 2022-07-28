import React, { useEffect, useState } from 'react'
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js'

function Game() {

    const [questions, setQuestions] = useState([])    

    async function getQuestions() {

        const resp = await fetch("https://opentdb.com/api.php?amount=5")
        const data = await resp.json()

        const queArr = await data.results.map(({question, correct_answer, incorrect_answers}) => {
                    
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

                if(questions.length === rightAnswers){
                    alert("You won!")
                }else{
                    alert("You lose!")
                }

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
    
    const questionlist = questions.map(({answers, text, id}) => {        

        return (
            <li className='question-group' key={id}>
                <h3 className='question'>{decodeHTMLCode(text)}</h3>
                <ul className='answer-group'>
                    {answers.map(answer => {
                        return (
                            <li className='answer' key={answer.id} onClick={() => selectAnswer(id, answer.id)} style={{backgroundColor: answer.bgColor, opacity: answer.fontOpacity}}>
                                {decodeHTMLCode(answer.text)}
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