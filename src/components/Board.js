import React from "react";
import STATUS from '../constants/status';
import { setClassName } from '../helper/helper.js';



const Board = ({inputs}) => {

    let currentRow = 1;
    const MAX_ROW = 6;
    let listOfRows = 1;

    function arrangeBoard() {
        currentRow++
        if(currentRow === MAX_ROW) {
            currentRow = 1;
            if(listOfRows != 6) {
                listOfRows++;
            }
        }
    }

    const setAnimationID = (grid) => {
        if (grid.status) {
            return "wordle-flip"
        }
    }

    const handleOnchange = (e) => {
        let key = e.keyCode
        if (((key >= 65 && key <= 90) || key == 8)) {
            let value = e.target.value;
            e.target.value = value.toLowerCase();
        } else {
            e.preventDefault();
        }
    }

    return (
        <div className="board">
            <ul> 
                {inputs.map((block, idx) => {
                    arrangeBoard()
                    return(
                        <React.Fragment key={idx}>
                            <li className={`row ${block.row}`}>
                                <input id={setAnimationID(block)}
                                   aria-label={block.position}
                                   type="text"
                                   maxLength={1}
                                   className={`wordle-grid ${setClassName(block)}`}
                                   defaultValue={block.val}
                                   disabled={!!block.frozen}
                                   onChange={handleOnchange} />
                            </li>
                            {listOfRows !== block.row ? <br></br> : <></>}
                        </React.Fragment>);
                    }
                )}
            </ul>
        </div>
    );
}
 
export default Board;
