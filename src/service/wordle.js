import axios from "axios";

export const getGuessResult = async (word, prevCorrectChars, prevPresentChars) => {
    const CORRECT = "correct";
    const PRESENT = "present";
    const response = await axios.get("https://wordle.votee.dev:8000/random", {
        params: {
            guess: word,
            seed: 1
        }
    });
    const charArray = response.data;
    const correctChars = prevCorrectChars;
    const presentChars = prevPresentChars;

    for (let i = 0; i < charArray.length; i++) {
        switch (charArray[i].result) {
            case CORRECT:
                correctChars[charArray[i].slot] = charArray[i].guess;
                break;
            case PRESENT:
                if (!presentChars.includes(charArray[i].guess)) {
                    presentChars.push(charArray[i].guess);
                    break;
                }

        }
    }

    const data = {correctChars, presentChars};
    console.log(data);
    return data;
}