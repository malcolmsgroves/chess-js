import { TYPE, COLORS, position } from './pieces';

const SQUARE    = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const DIAGONAL  = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const KNIGHT    = [[1, 2], [1, -2], [-1, 2], [-1, -2],
                  [2, 1], [2, -1], [-2, 1], [-2, -1]];
function makeMove(start, end, game) {
  const color = game.board[start.row][start.col];
  let newGame = JSON.parse(JSON.stringify(game));
  newGame.highlightedMoves = [];
  newGame.board[end.row][end.col] = newGame.board[start.row][start.col];
  newGame.board[start.row][start.col] = null;
  newGame.inCheck = isCheck(color, newGame);
  return newGame;
}

function possibleMoves(start, game) {
  const piece = game.board[start.row][start.col];
  if(piece === null) return [];
  let moves = [], opts;
  switch(piece.type) {
    case TYPE.KING:
      opts = { isSquare: true, isDiagonal: true, isStep: true };
      moves = getMoves(start, game, opts);
      break;
    case TYPE.QUEEN:
      opts = { isSquare: true, isDiagonal: true };
      moves = getMoves(start, game, opts);
      break;
    case TYPE.ROOK:
      opts = { isSquare: true };
      moves = getMoves(start, game, opts);
      break;
    case TYPE.BISHOP:
      opts = { isDiagonal: true };
      moves = getMoves(start, game, opts);
      break;
    case TYPE.KNIGHT:
      moves = knightMoves(start, game);
      break;
    case TYPE.PAWN:
      moves = pawnMoves(start, game);
      break;
    default: return [];
  }

  return moves;
}

function isCheck(color, game) {
  const opponent = color === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
  let king = null;

  for(let r = 0; r < 8; ++r) {
    for(let c = 0; c < 8; ++c) {
      const curr = game.board[r][c];
      if(curr && curr.type === TYPE.KING) {
        king = position(r, c);
        break;
      }
    }
    if(king) break;
  }
  for(let r = 0; r < 8; ++r) {
    for(let c = 0; c < 8; ++c) {
      const pos = position(r, c);
      const piece = game.board[r][c];
      if(piece !== null && piece.color === opponent && possibleMoves(pos, game).includes(king)) {
        return true;
      }
    }
  }
  return false;
}

function legalMoves(start, game) {
  const moves = possibleMoves(start, game);
  if(moves.length === 0) return [];
  let legalMoves = [];
  let color = game.board[start.row][start.col].color;
  for(let i = 0; i < moves.length; ++i) {
    let newGame = makeMove(start, moves[i], game);
    if(!isCheck(color, newGame)) legalMoves.push(moves[i]);
  }
  return legalMoves;
}

function getMoves(start, game, opts) {
  let moves = [];
  let deltas = [];
  if(opts.isSquare) deltas.concat(SQUARE);
  if(opts.isDiagonal) deltas.concat(DIAGONAL);
  for(let delta in deltas) {
    let currMove = position(start.row + delta[0], start.col + delta[1]);
    while(onBoard(currMove) && !opts.isStep && game.board[currMove.row][currMove.col] === null) {
      moves.push(currMove);
      currMove = position(currMove.row + delta[0], currMove.col + delta[1]);
    }
    if(onBoard(currMove) && game.board[currMove.row][currMove.col] !== game.turn) {
      moves.push(currMove);
    }
  }
  return moves;
}

function knightMoves(start, game) {
  let moves = [];
  for(let delta in KNIGHT) {
    const move = position(start.row + delta[0], start.col + delta[1]);
    if(onBoard(move) && game.board[move.row][move.col].color !== game.turn) moves.push(move);
  }
  return moves;
}

function pawnMoves(start, game) {
  const pawn = game.board[start.row][start.col];
  const opponent = game.turn === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
  let moves = [];
  let delta = 1;
  let unmoved = start.row === 1;
  if(pawn.color === COLORS.WHITE) {
    delta = -1;
    unmoved = start.row === 6;
  }
  const forward = game.board[start.row + delta][start.col];
  const left = game.board[start.row + delta][start.col - 1];
  const right = game.board[start.row + delta][start.col + 1];
  if(forward === null) {
    moves.push(position(start.row + delta, start.col));
    if(unmoved && game.board[start.row + 2 * delta][start.col] === null) {
      moves.push(position(start.row + 2 * delta, start.col));
    }
  }
  if(right && right.color === opponent) {
    moves.push(position(start.row + delta, start.col + 1));
  }
  if(left && left.color === opponent) {
    moves.push(position(start.row + delta, start.col - 1));
  }
  return moves;
}

function onBoard(move) {
  return move.col >= 0 && move.col < 8 && move.row >= 0 && move.row < 8;
}

function includesMove(move, moves) {
  console.log(move);
  console.log(moves);
  for(let i = 0; i < moves.length; ++i) {
    if(move.row === moves[i].row && move.col === moves[i].col) {
      return true;
    }
  }
  console.log('not okay');
  return false;
}

export default makeMove;
export { legalMoves, includesMove };
