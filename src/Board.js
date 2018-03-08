import React from 'react';
import { pieceToHTML, position } from './game/pieces';
import { includesMove } from './game/moves';
import './Board.css';
/*
  Board is a presentation component for the chess board that is responsible
  for rendering the board object from the Game container.
*/
function Board(props) {

  const boardElement = props.board.map((row, r) => {
    let dark = r % 2 === 0;
    const rowElement = row.map((piece, c) => {
      dark = !dark;
      let colorClass = "";
      if(includesMove(position(r, c), props.highlightedMoves))colorClass += "highlight-";
      else if(props.selectedPosition &&
              props.selectedPosition.row === r &&
              props.selectedPosition.col === c) colorClass += "selected-";
      if(dark) colorClass += "dark";
      else colorClass += "light";

      return <li  className={ colorClass }
                  key={`${r}${c}`}
                  id={`${r}${c}`}
                  onClick={props.onClick}>{ pieceToHTML(piece) }</li>
    });
    return rowElement;
  });
  return <ul className="board">{ boardElement }</ul>;
}

export default Board;
