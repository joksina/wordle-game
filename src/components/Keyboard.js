import React from "react";
import STATUS from '../constants/status';
import { setClassName } from '../helper/helper.js';



const Qwerty = ({letters}) => {

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
