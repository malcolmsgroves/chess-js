import makeMove, { legalMoves, includesMove, onBoard, isCheck, isCheckMate,
                   nonCheckMoves, findKing, possibleMoves } from './moves';
import { blankGameTest, piece, COLORS, TYPE, position} from './pieces';

it('can tell if a move is included in an array', () => {
  let moves = [];
  for(let i = 0; i < 10; ++i) {
    moves.push(position(i, i + 1));
  }
  const pos1 = position(5, 6);
  const pos2 = position(1, 2);
  const posFalse = position(3, 2);
  expect(includesMove(pos1, moves)).toBeTruthy();
  expect(includesMove(pos2, moves)).toBeTruthy();
  expect(includesMove(posFalse, moves)).not.toBeTruthy();
})

it('makes a move', () => {
  let game = blankGameTest();
  const queen = piece(TYPE.QUEEN, COLORS.WHITE);
  game.board[4][4] = queen;
  expect(game.board[4][4]).toEqual(queen);
  expect(game.board[7][7]).toBeNull();
  const start = position(4, 4);
  const end = position(7, 7);
  game = makeMove(start, end, game);
  expect(game.board[4][4]).toBeNull();
  expect(game.board[7][7]).toEqual(queen);
  expect(game.turn).toBe(COLORS.BLACK);
})

it('detects check', () => {
  let game = blankGameTest();
  const whiteQueen = piece(TYPE.QUEEN, COLORS.WHITE);
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const whiteKing = piece(TYPE.KING, COLORS.WHITE);
  game.board[4][4] = whiteQueen;
  game.board[7][4] = blackKing;
  game.board[0][4] = whiteKing;
  expect(isCheck(COLORS.BLACK, game)).toBeTruthy();
  expect(isCheck(COLORS.WHITE, game)).not.toBeTruthy();
  expect(isCheckMate(COLORS.BLACK, game)).not.toBeTruthy();
})

it('detects checkmate', () => {
  let game = blankGameTest();
  const whiteKing = piece(TYPE.KING, COLORS.WHITE);
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const whiteRook = piece(TYPE.ROOK, COLORS.WHITE);
  game.board[3][5] = whiteKing;
  game.board[3][7] = blackKing;
  game.board[7][7] = whiteRook;
  expect(isCheckMate(COLORS.WHITE, game)).not.toBeTruthy();
  expect(isCheckMate(COLORS.BLACK, game)).toBeTruthy();
})

it('updates game after move', () => {
  let game = blankGameTest();
  const whiteKing = piece(TYPE.KING, COLORS.WHITE);
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const whiteRook = piece(TYPE.ROOK, COLORS.WHITE);
  game.board[3][4] = whiteKing;
  game.board[3][7] = blackKing;
  game.board[7][7] = whiteRook;
  const start = position(3, 4);
  const end = position(3, 5);
  const newGame = makeMove(start, end, game);
  expect(newGame.turn).toEqual(COLORS.BLACK);
  expect(newGame.inCheck).toBeTruthy();
  expect(newGame.checkMate).toBeTruthy();
})

it('gets pawn moves', () => {
  let game = blankGameTest();
  const whitePawn = piece(TYPE.PAWN, COLORS.WHITE);
  const blackPawn = piece(TYPE.PAWN, COLORS.BLACK);
  const whiteStart = position(6, 5);
  const blackStart = position(2, 7);
  const whiteMove = position(4, 5);
  const blackMove = position(3, 7);
  const blackFalseMove = position(4, 7);
  game.board[6][5] = whitePawn;
  game.board[2][7] = blackPawn;
  const whiteMoves = legalMoves(whiteStart, game);
  game.turn = COLORS.BLACK;
  const blackMoves = legalMoves(blackStart, game);
  const noMoves = legalMoves(whiteMove, game);
  expect(includesMove(whiteMove, whiteMoves)).toBeTruthy();
  expect(includesMove(blackMove, blackMoves)).toBeTruthy();
  expect(includesMove(blackFalseMove, blackMoves)).not.toBeTruthy();
  expect(noMoves).toHaveLength(0);
})

it('gets queen moves', () => {
  let game = blankGameTest();
  const whiteQueen = piece(TYPE.QUEEN, COLORS.WHITE);
  const pos = position(4, 4);
  game.board[pos.row][pos.col] = whiteQueen;
  const moves = legalMoves(pos, game);
  const move1 = position(1, 7);
  const move2 = position(4, 0);
  const move3 = position(7, 4);
  const moveFalse = position(5, 6);
  expect(includesMove(move1, moves)).toBeTruthy();
  expect(includesMove(move2, moves)).toBeTruthy();
  expect(includesMove(move3, moves)).toBeTruthy();
  expect(includesMove(moveFalse, moves)).not.toBeTruthy();
  game.turn = COLORS.BLACK;
  expect(legalMoves(pos, game)).toHaveLength(0);
})

it('finds the king', () => {
  let game = blankGameTest();
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const pos = position(4, 5);
  game.board[4][5] = blackKing;
  expect(findKing(COLORS.BLACK, game)).toEqual(pos);
})
