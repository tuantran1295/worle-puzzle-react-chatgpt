import {FiRefreshCw, FiCheck} from "react-icons/fi";
import './App.css';
import {useEffect, useRef, useState} from "react";
import {getGuessWordFromChatGPT} from "./service/chatgpt";
import {getGuessResult} from "./service/wordle";

function App() {
    const [wordList, setWords] = useState([]);
    const [guessing, setGuessing] = useState(false);
    const [message, setMessage] = useState('');
    const correctCharsRef = useRef(new Array(5).fill(''));
    const presentCharsRef = useRef([]);
    const wordRegex = /^[a-zA-Z]{5}$/;
    const timer = ms => new Promise((res) => setTimeout(res, ms));

    const resetGame = () => {
        setWords([]);
        setGuessing(false);
        setMessage('');
        correctCharsRef.current = new Array(5).fill('');
        presentCharsRef.current = [];
    }

    async function startGussWord() {
        resetGame();
        setGuessing(true);
        let guessWord = "start";
        const excludedWords = [guessWord];
        while (true) {
            if (wordRegex.test(guessWord)) {
                const {
                    correctChars,
                    presentChars
                } = await getGuessResult(guessWord, correctCharsRef.current, presentCharsRef.current);
                correctCharsRef.current = correctChars;
                presentCharsRef.current = presentChars;
                await timer(2000);

                if (!correctChars.includes('')) {
                    setGuessing(false);
                    setMessage(`The correct word is ${guessWord}`);
                    setWords(prevState => [...prevState]); // trigger re-render
                    console.log(`The correct word is ${guessWord}`);
                    return;
                }
            }

            guessWord = await getGuessWordFromChatGPT(correctCharsRef.current, presentCharsRef.current, excludedWords);
            if (wordRegex.test(guessWord)) {
                setWords(prevState => [...prevState, guessWord].slice(-5));
                if (!excludedWords.includes(guessWord)) {
                    excludedWords.push(guessWord);
                }
            }

        }
    }

return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                    <div className="divide-y divide-gray-200">
                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Wordle Puzzle</h1>

                            {message && (
                                <div className="text-center mb-4 font-semibold text-blue-600">
                                    {message}
                                </div>
                            )}

                            <div className="grid grid-rows-6 gap-2" role="grid" aria-label="Wordle puzzle grid">
                                {wordList.map((guess, rowIndex) => (
                                    <div key={rowIndex} className="flex justify-center gap-2">
                                        {[0, 1, 2, 3, 4].map((colIndex) => (
                                            <input
                                                key={colIndex}
                                                type="text"
                                                maxLength="1"
                                                value={guess[colIndex] || ""}
                                                className={`w-12 h-12 border-2 rounded-lg text-center text-2xl uppercase font-bold focus:outline-none focus:border-blue-500 transition-colors
                            ${correctCharsRef.current[colIndex] === guess[colIndex].toLowerCase() ? "bg-green-500 text-white border-green-600" :
                                                    presentCharsRef.current.includes(guess[colIndex].toLowerCase()) ? "bg-yellow-500 text-white border-yellow-600" :
                                                        "border-gray-300"}
                          `}
                                                disabled={true}
                                                aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={startGussWord}
                                    disabled={guessing}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Submit guess"
                                >
                                    Auto Guess
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

export default App;
