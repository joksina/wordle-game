import React from "react";
import STATUS from '../constants/status';


const Qwerty = ({letters}) => {

    const setClassName = (letter) => {
        if(letter.status === STATUS.FOUND) {
            return 'wordle-green';
        } else if (letter.status === STATUS.CONTAINS) {
            return 'wordle-yellow';
        } else if (letter.status === STATUS.BAD) {
            return 'wordle-gray';
        } else {
            return "";
        }
    }

    return (
        <div className="wordle-wrapper-keyboard">
            <div className="wordle-keyboard">
                {letters.map(letter => {
                    if(letter.letter !== undefined){
                    return(
                        <React.Fragment key={letter.id}>
                            <button className={`keyboard-button ${setClassName(letter)}`} 
                                    key={letter.id}>
                                {letter.letter}
                            </button>
                            {letter.letter === "p" ? <br></br> : null}
                            {letter.letter === "l" ? <br></br> : null}
                        </React.Fragment>
                    );
                    }
                })}
            </div>
        </div>
    );
}
 
export default Qwerty;
