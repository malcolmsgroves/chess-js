import React, { Component } from 'react';
import createGame, { position } from './game/pieces';
import makeMove, { possibleMoves } from './game/moves';
import Board from './Board';
import './Game.css';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = createGame();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
    const id = parseInt(event.target.id);
    const row = Math.floor(id / 10), col = id % 10;
    const start = position(row, col);
    const moves = possibleMoves(start, this.state);
    this.setState({...this.state, highlightedMoves: moves });
  }
  render() {
    return (
      <Board onClick={this.handleClick} board={this.state.board}/>
    )
  }
}

export default Game;
