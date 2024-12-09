import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, useState} from "react";
import {getGuessWordFromChatGPT} from "./service/chatgpt";
import {getGuessResult} from "./service/wordle";

function App() {
  const [wordList, setWords] = useState([]);
  const [guessing, setGuessing] = useState(false);
  const correctCharsRef = useRef(new Array(5).fill(''));
  const presentCharsRef = useRef([]);
  const wordRegex = /^[a-zA-Z]{5}$/;
  const timer = ms => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    async function startGussWord() {
      setGuessing(true);
      let guessWord = "start";
      const excludedWords = [guessWord];
      while (true) {
        if (wordRegex.test(guessWord)) {
          const {correctChars, presentChars} = await getGuessResult(guessWord, correctCharsRef.current, presentCharsRef.current);
          correctCharsRef.current = correctChars;
          presentCharsRef.current = presentChars;

          if (!correctChars.includes('')) {
            setGuessing(false);
            setWords(prevState => [...prevState]); // trigger re-render
            console.log(`The correct word is ${guessWord}`);
            return;
          }
        }

        guessWord = await getGuessWordFromChatGPT(correctCharsRef.current, presentCharsRef.current, excludedWords);
        if (wordRegex.test(guessWord)) {
          setWords(prevState => [...prevState, guessWord].slice(-5));
        }
        await timer(3000);
      }
    }
    startGussWord();
  }, [])
  return (
    <div className="App">
      {wordList}
    </div>
  );
}

export default App;
