import axios from "axios";

export const getGuessWordFromChatGPT = async (correctChars, presentChars, excludedWords) => {
    let prompt = "We are playing a Wordle-style game. Guess the 5-letter word. Display the word only. ";
    if (correctChars[0]) prompt += ` start with ${correctChars[0]}`;
    if (correctChars[1]) prompt += `, second letter is ${correctChars[1]}`;
    if (correctChars[2]) prompt += `, third letter is ${correctChars[2]}`;
    if (correctChars[3]) prompt += `, fourth letter is ${correctChars[3]}`;
    if (correctChars[4]) prompt += `, end with ${correctChars[4]}`;
    if (presentChars.length > 0) prompt += ` and letters in the word include ${presentChars}`;
    if (excludedWords.length > 0) prompt += ` and the word excludes ${excludedWords}`;
    console.log(prompt);

    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        "model":"gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 5,
        "top_p": 0.9
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
        }
    });
    const word = response.data.choices[0].message.content;
    console.log(word);
    return word;
}