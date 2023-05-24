import React from "react";
import STATUS from '../constants/status';


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

    const setClassName = (box) => {
        if(box.status === STATUS.FOUND) {
            return 'wordle-board-green';
        } else if (box.status === STATUS.CONTAINS) {
            return 'wordle-board-yellow';
        } else if (box.status === STATUS.BAD) {
            return 'wordle-board-gray';
        } else {
            return "";
        }
    }

    const handleOnchange = (e) => {
        let value = e.target.value;
        e.target.value = value.toLowerCase();
    }

    return (
        <div className="board">
            <ul> 
                {inputs.map((block, idx) => {
                    arrangeBoard()
                    return(
                        <React.Fragment key={idx}>
                            <li className={"row" + block.row}>
                                <input id={setClassName(block)}
                                   aria-label={block.position}
                                   type="text"
                                   maxLength={1}
                                   className={"wordle-guess"}
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
