import React, { Component } from 'react';
import createGame, { position } from './game/pieces';
import makeMove, { legalMoves } from './game/moves';
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
    const start = position(row, col);
    const state = this.state;
    const moves = legalMoves(start, state);

    this.setState({
      highlightedMoves: moves,
    })
    console.log('done');
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
