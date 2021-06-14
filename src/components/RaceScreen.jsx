import { useState, useEffect } from 'react'
const axios = require('axios').default;

function Player({name, score}){
    return (
        <div 
         style={{
            padding: '30px 100px',
            marginRight: '10px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid lightgray',
         }}>
            <p>{name}</p>
            <p>Score: {score}</p>
        </div>
    )
}

function Selection({
    charactersList, 
    selectedCharacter, 
    setSelectedCharacter, 
    setPlayer1, 
    setPlayer2, 
    player1, 
    player2
}){

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <p style={{ marginRight: '15px' }}>Select Player {player1.name ? 2 : 1}: </p>
            <select style={{ marginRight: '15px' }} onChange={(e)=> {
                setSelectedCharacter(e.target.value)
            }}>
                {
                    charactersList.map((character) => {
                        return <option key={character.id} value={character.name}>{character.name}</option>
                    })
                }
            </select>
            <button onClick={()=>{  
                player1.name ? setPlayer2({...player2, name: selectedCharacter}) 
                : setPlayer1({...player1, name: selectedCharacter})
            }}>Seleccionar</button>
        </div>
    )
}



function RaceScreen(){
    const [characters, setCharacters] = useState([])
    const [selectedCharacter, setSelectedCharacter] = useState('Rick Sanchez')
    const [player1, setPlayer1] = useState({'name': null,'score': 0})
    const [player2, setPlayer2] = useState({'name': null, 'score': 0})
    const [isRunning, setIsRunning] = useState(false)
    const [winner, setWinner] = useState(null)


    useEffect(() => {
        getCharacters()
    }, []);

    useEffect(() => {
        if (isRunning){
            const id = window.setInterval(() => {
                // preguntar por que aqui no funcionaba la condicional de el score de los players
                setPlayer1(player1 => ({...player1, 'score': player1.score + getRandomArbitrary(0,20)}));
                setPlayer2(player2 => ({...player2, 'score': player2.score + getRandomArbitrary(0,20)}));
            }, 1000);
            return () => window.clearInterval(id)
        }
        return undefined
    }, [isRunning]);


    useEffect(() => {
        if (player1.score >= 100 || player2.score >= 100) {
            setIsRunning(false)
            player1.score > player2.score ? setWinner({...player1}) : setWinner({...player2})
        } 
    }, [player1, player2])


    const getCharacters = async () => {
            try {
                const response = await axios.get('https://rickandmortyapi.com/api/character')
                setCharacters(response.data.results)
            } catch (error) {
                console.error(error);
            }
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
      }

    const startRace = () => {
        setIsRunning(true)
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <h1>Race App!!</h1>

            {
                player1.name && player2.name ? <button onClick={startRace} >Start race!</button>
                :
                <Selection 
                    charactersList={characters} 
                    selectedCharacter={selectedCharacter} 
                    setSelectedCharacter={setSelectedCharacter}
                    player1={player1}
                    player2={player2}
                    setPlayer1={setPlayer1}
                    setPlayer2={setPlayer2}
                />
            }
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '20px',
            }}>
                { player1.name ? <Player id="player1" name={player1.name} score={parseInt(player1.score)}/> : null}
                { player2.name ? <Player id="player1" name={player2.name} score={parseInt(player2.score)}/> : null}
            </div>
            {winner ? <p>The winner is: {winner.name} - {parseInt(winner.score)} 🎊🎉🥳🥳!!</p>: null}
        </div>
    )
}

export default RaceScreen