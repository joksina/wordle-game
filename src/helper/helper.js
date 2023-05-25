import STATUS from '../constants/status';


export function setClassName(letter) {
    if(letter.status === STATUS.CORRECT) {
        return 'wordle-green';
    } else if (letter.status === STATUS.CONTAINS) {
        return 'wordle-yellow';
    } else if (letter.status === STATUS.INCORRECT) {
        return 'wordle-gray';
    } else {
        return "";
    }
}