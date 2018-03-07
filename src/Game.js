import React, { Component } from 'react';
import createGame, { position } from './game/pieces';
import makeMove, { legalMoves, includesMove } from './game/moves';
import Board from './Board';
import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = createGame();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    const id = parseInt(event.target.id, 10);
    const row = Math.floor(id / 10), col = id % 10;
    const pos = position(row, col);
    if(includesMove(pos, this.state.highlightedMoves)) {
      const newGame = makeMove(this.state.selectedPosition, pos, this.state);
      this.setState(newGame);
    }
    else {
      const moves = legalMoves(pos, this.state);
      this.setState({
        highlightedMoves: moves,
        selectedPosition: pos,
      })
    }
  }

  render() {
    return (
      <Board  onClick={this.handleClick}
              board={this.state.board}
              highlightedMoves={this.state.highlightedMoves}/>
    )
  }
}

export default Game;
