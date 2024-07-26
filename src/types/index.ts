export type Status = string;

export type LetterGuess = {
    letter: string,
    status: Status,
}

export type GuessedLetters = {
    [key: string]: Status;
}

export type Guess = {
    guess: string;
    letters: LetterGuess[];
}
export type GameState = {
    [key: string]: {
        wordOfTheDay: string;
        guesses: Guess[];
        guessedLetters: GuessedLetters
    }
}