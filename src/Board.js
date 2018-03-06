import React, { Component } from 'react';
import { pieceToHTML } from './game/pieces';
import './Board.css';
/*
  Board is a presentation component for the chess board that is responsible
  for rendering the board object from the Game container.
*/
function Board(props) {
  const boardElement = props.board.map((row, r) => {
    let color = r % 2;
    const rowElement = row.map((piece, c) => {
      color = !color;
      return <li  className={ isColored(color) }
                  key={`${r}${c}`}
                  id={`${r}${c}`}
                  onClick={props.onClick}>{ pieceToHTML(piece) }</li>
    });
    return rowElement;
  });
  return <ul className="board">{ boardElement }</ul>;
}

const isColored = color => color ? 'dark' : 'light';

export default Board;
