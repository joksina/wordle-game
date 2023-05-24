import {useState, useEffect, useCallback} from 'react';
import Keyboard from './components/Keyboard';
import Board from './components/Board';
import words from './constants/five-words';
import alphabet from './constants/qwerty';
import STATUS from './constants/status';


function App() {
    const [word, setWord] = useState('');
    const [guesses, setCurrentGuess] = useState(null);
    const [boardGuesses, setBoardGuesses] = useState([]);
    const [termsValidation, setTermsValidation] = useState(false);
    const [gameState, setGame] = useState(false);
    let currentRow = getWordleRowProgress();
    let currentCell = 0;
    const MAX_ROW = 6;
    const MAX_WORD = 5;

    
    useEffect(() => {
        setGame(JSON.parse(localStorage.getItem("wordleGameState")));
        if(gameState == true){
            let newLetter = boardGuesses;
            for(let i = 0; i < boardGuesses.length; i++){
                newLetter[i].frozen = true;
            }
            setBoardGuesses(newLetter);
        }
    }, [gameState]);

    useEffect(() => {
        if (!guesses) {
            setTermsValidation(true);
        } else {
            setTermsValidation(false);
        }
    }, [termsValidation]);


    function saveBoardProgress(board) {
        localStorage.setItem("wordleBoardProgress", JSON.stringify(board));
    }

    function boardProgress(board) {
        if(localStorage.getItem("wordleBoardProgress") === null) {
            saveBoardProgress(board);
        }
        return JSON.parse(localStorage.getItem("wordleBoardProgress"));
    }

    function getWordleRowProgress() {
        if(localStorage.getItem("currentRowProgress") === null) {
            localStorage.setItem("currentRowProgress", JSON.stringify(1));
        }
        return JSON.parse(localStorage.getItem("currentRowProgress"));
    }

    function changeRowProgress(row) {
        localStorage.setItem("currentRowProgress", JSON.stringify(row));
    }

    function wordleCurrentDate() {
        if(localStorage.getItem("currentDate") === null) {
            localStorage.setItem("currentDate", JSON.stringify({}));
        }
        return JSON.parse(localStorage.getItem("currentDate"));
    }

    function setCurrentDate(date) {
        localStorage.setItem("currentDate", JSON.stringify(date));
    }

    function getQuerySelectorforGrid(arg) {
        return document.querySelectorAll("[aria-label='" + currentRow + ":" + arg + "']")[0].value;
    }

    function disableNextRow(id) {
        let nextBoardLine = document.getElementsByClassName("row" + id);
        for (let i = 0; i < nextBoardLine.length; i++) {
            nextBoardLine[i].querySelector("input").setAttribute("disabled", "true");
        }
    }


    function setBoardLetters(letter, status) {
        let result = guesses;
        let index = result.findIndex((obj) => obj.letter === letter);
        result[index].status = status;

        setCurrentGuess(([...guesses, result]));
    }

    function checkGuess(guess) {
        if(guess.length !== MAX_WORD) {
            return;
        }

        for (let i = 0; i < guess.length; i++) {
            if(guess[i] === word[i]) {
                setBoardLetters(guess[i].toLowerCase(), STATUS.FOUND);
            } else if(word.includes(guess[i])) {
                let index = guesses.findIndex((obj) => obj.letter === guess[i]);
                if(guesses[index].status !== STATUS.FOUND){
                    setBoardLetters(guess[i].toLowerCase(), STATUS.CONTAINS);
                }
            } else {
                setBoardLetters(guess[i].toLowerCase(), STATUS.BAD);
            }
        }
        localStorage.setItem("wordleProgress", JSON.stringify(guesses));
    }

    const getAlphabets = () => {
        let result = [];
        const status = STATUS.UNKNOWN;
        let id = 0;
        if (!localStorage.getItem("wordleProgress")) {
            alphabet.map((letter) => {
                id++;
                result.push({id, letter, status});
            });
            localStorage.setItem("wordleProgress", JSON.stringify(result));
            return result;
        } else {
            return JSON.parse(localStorage.getItem("wordleProgress"));
        }
    }

    function handleSubmit() {
        let guessedWord = "";
        for(var i = 1; i <= MAX_WORD; i++){
            guessedWord += getQuerySelectorforGrid(i);
        }
        if (words.includes(guessedWord)) {
            handleStatus();
            if (guessedWord.length === MAX_WORD) {
                if (guessedWord === word) {
                    for(var i = 1; i <= MAX_ROW; i++){
                        disableNextRow(i);
                    }
                    localStorage.setItem("wordleGameState", JSON.stringify(true));
                    setGame(JSON.parse(localStorage.getItem("wordleGameState"))); 
                    alert("You Win!");
                } else {
                    if (currentRow === MAX_ROW) {
                        alert("Try again tomorrow. Correct Word is " + word);
                    }
                }
            } else {
                alert("Not enough words!");
            }
            currentRow++;
            changeRowProgress(currentRow);
            currentCell = 0;

        } else {
            alert("Word not in list!");
        }
        checkGuess(guessedWord);
    }

    function assignBoardStatus() {
        let statusIndex = 1;
        for(var i = 0; i < word.length; i++){
            var index = boardGuesses.findIndex((letter) => letter.row === currentRow && letter.column === statusIndex);
            if(word[i] === getQuerySelectorforGrid(statusIndex)){
                boardGuesses[index].status = STATUS.FOUND;
            }else if(word.includes(getQuerySelectorforGrid(statusIndex))){
                boardGuesses[index].status = STATUS.CONTAINS;
            }

            if(boardGuesses[index].status !== STATUS.FOUND && boardGuesses[index].status !== STATUS.CONTAINS){
                boardGuesses[index].status = STATUS.BAD;
            }
            statusIndex++;
        }
    }

    function handleStatus() {
        let result = boardGuesses;
        const correctWord = word;

        for(var i = 1; i <= MAX_WORD; i++){
            let index = result.findIndex((res) => res.row === currentRow && res.column === i);
            result[index].val = getQuerySelectorforGrid(i);
            result[index].frozen = true;
        }

        assignBoardStatus();
        setBoardGuesses(result); 
        saveBoardProgress(boardGuesses);
    }

    function handleDelete() {
        if(currentCell !== 0){
            currentCell--;
            document.querySelectorAll("[aria-label='" + currentRow + ":" + (currentCell +1) + "']")[0].focus();
        } else {
            document.querySelectorAll("[aria-label='" + currentRow + ":" + 1 + "']")[0].focus();
        }
    }

    const handleKeyDown = useCallback(event => {
        if(currentRow <= MAX_ROW){
            currentRow = getWordleRowProgress();
            if(event.key === "Backspace") {
                handleDelete();
            } else if(event.key === "Enter") {
                handleSubmit();
            } else {
                if(currentCell !== MAX_WORD) {
                    currentCell++;
                    document.querySelectorAll("[aria-label='" + currentRow + ":" + currentCell+ "']")[0].focus();
                }
            }
        }
    }, [termsValidation]);

    useEffect(() => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        let currentDate = {today};
        if(JSON.stringify(currentDate) !== JSON.stringify(wordleCurrentDate())){
        let targetWord = words[Math.floor(Math.random()*words.length)];
            console.log("Target word is ", targetWord)
            localStorage.removeItem("wordleBoardProgress");
            localStorage.removeItem("wordleProgress");
            setWord(targetWord);
            changeRowProgress(1);
            initBoard();
            setCurrentGuess(getAlphabets());
            
            localStorage.setItem("wordleGameState", JSON.stringify(false));
            setCurrentDate(currentDate);
        }

        setCurrentGuess(getAlphabets());
        document.addEventListener("keydown", handleKeyDown)
        return() => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const initBoard = useCallback (async() => {
        const board = [];
        for (var i = 1; i <= MAX_ROW; i++) {
            for (var j = 1; j <= MAX_WORD; j++) {
                board.push({
                    "position": `${i}:${j}`,
                    "val": "",
                    "row": i,
                    "column": j,
                    "fozen": false,
                    "status": STATUS.UNKNOWN
                });
            }
        }
        setBoardGuesses(boardProgress(board));
    }, []);

    useEffect(() => {
        initBoard();
    }, [initBoard]);
  

  return (
    <div className="App">
      <h1> Wordle </h1>
      {boardGuesses && <Board inputs={boardGuesses}></Board>}

      {guesses && <Keyboard letters={guesses}></Keyboard>}
    </div>
  );
}

export default App;
