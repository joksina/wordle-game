import React from "react";
import STATUS from '../constants/status';


const Qwerty = ({letters}) => {

    return (
        <div className="letter-wrapper">
            <div className="letter-buttons">
                {letters.map(letter => {
                    if(letter.letter !== undefined){
                    return(
                        <React.Fragment key={letter.id}>
                            <button className={`keyboard-button`} 
                                    key={letter.id}>
                                {letter.letter}
                            </button>
                            {letter.letter === "p" ? <pre></pre> : null}
                            {letter.letter === "l" ? <pre></pre> : null}
                        </React.Fragment>
                    );
                    }
                })}
            </div>
        </div>
    );
}
 
export default Qwerty;
