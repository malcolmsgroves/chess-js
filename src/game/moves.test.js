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


describe('any piece can put the king in check', () => {
  let game;
  const whiteKing = piece(TYPE.KING, COLORS.WHITE);
  const blackKing = piece(TYPE.KING, COLORS.BLACK);

  beforeEach(() => {
    game = blankGameTest();
    game.board[0][0] = whiteKing;
    game.board[4][5] = blackKing;
  });

  it('checks king with queen', () => {
    const whiteQueen = piece(TYPE.QUEEN, COLORS.WHITE);
    game.board[7][5] = whiteQueen;
    expect(isCheck(COLORS.BLACK, game)).toBeTruthy();
    expect(isCheck(COLORS.WHITE, game)).not.toBeTruthy();
    expect(isCheckMate(COLORS.BLACK, game)).not.toBeTruthy();
  })

  it('checks king with pawn', () => {
    const whitePawn = piece(TYPE.PAWN, COLORS.WHITE);
    game.board[5][4] = whitePawn;
    expect(isCheck(COLORS.BLACK, game)).toBeTruthy();
    expect(isCheck(COLORS.WHITE, game)).not.toBeTruthy();
    expect(isCheckMate(COLORS.BLACK, game)).not.toBeTruthy();
  })

  it('checks king with knight', () => {
    const whiteKnight = piece(TYPE.KNIGHT, COLORS.WHITE);
    game.board[2][4] = whiteKnight;
    expect(isCheck(COLORS.BLACK, game)).toBeTruthy();
    expect(isCheck(COLORS.WHITE, game)).not.toBeTruthy();
    expect(isCheckMate(COLORS.BLACK, game)).not.toBeTruthy();
  })

  it('does not falsely id check', () => {
    expect(isCheck(COLORS.BLACK, game)).not.toBeTruthy();
  })
})


it('detects checkmate', () => {
  let game = blankGameTest();
  const whiteKing = piece(TYPE.KING, COLORS.WHITE);
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const blackRook = piece(TYPE.ROOK, COLORS.BLACK);
  game.board[3][5] = blackKing;
  game.board[3][7] = whiteKing;
  game.board[7][7] = blackRook;
  expect(isCheckMate(COLORS.BLACK, game)).not.toBeTruthy();
  expect(isCheckMate(COLORS.WHITE, game)).toBeTruthy();
})

it('finds the king', () => {
  let game = blankGameTest();
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const pos = position(4, 5);
  game.board[4][5] = blackKing;
  expect(findKing(COLORS.BLACK, game)).toEqual(pos);
})

describe('making a move and updating the game', () => {
  let game;

  beforeEach(() => {
    game = blankGameTest();
  })

  it('moves the queen and switches the move', () => {
    const whiteQueen = piece(TYPE.QUEEN, COLORS.WHITE);
    game.board[4][4] = whiteQueen;
    expect(game.board[4][4]).toEqual(whiteQueen);
    expect(game.board[7][7]).toBeNull();
    const start = position(4, 4);
    const end = position(7, 7);
    game = makeMove(start, end, game);
    expect(game.board[4][4]).toBeNull();
    expect(game.board[7][7]).toEqual(whiteQueen);
    expect(game.turn).toBe(COLORS.BLACK);
  })

  it('updates check and checkmate after move', () => {
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
})

describe('getting moves for each piece', () => {
  let game;
  beforeEach(() => {
    game = blankGameTest();
  })
  it('gets pawn moves for each color', () => {
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
})

describe('possibleMoves, nonCheckMoves, and legalMoves', () => {
  let game = blankGameTest();
  game.turn = COLORS.BLACK;
  const whiteKing = piece(TYPE.KING, COLORS.WHITE);
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const blackBishop = piece(TYPE.BISHOP, COLORS.BLACK);
  const whiteKingPosition = position(5, 4);
  game.board[2][2] = blackBishop;
  game.board[2][6] = blackKing;
  game.board[5][4] = whiteKing;
  const posCheck1 = position(5, 5);
  const posCheck2 = position(4, 4);
  const posNoCheck1 = position(5, 3);
  const posNoCheck2 = position(4, 3);
  const posNoCheck3 = position(6, 5);
  const posFalse = position(7, 6);

  it('gives all possible moves with possibleMoves', () => {
    const moves = possibleMoves(whiteKingPosition, game);
    expect(includesMove(posCheck1, moves)).toBeTruthy();
    expect(includesMove(posCheck2, moves)).toBeTruthy();
    expect(includesMove(posNoCheck1, moves)).toBeTruthy();
    expect(includesMove(posFalse, moves)).not.toBeTruthy();
  })

  it('omits check moves with nonCheckMoves', () => {
    const moves = nonCheckMoves(whiteKingPosition, game);
    expect(includesMove(posCheck1, moves)).not.toBeTruthy();
    expect(includesMove(posCheck2, moves)).not.toBeTruthy();
    expect(includesMove(posNoCheck2, moves)).toBeTruthy();
    expect(includesMove(posNoCheck3, moves)).toBeTruthy();
  })

  it('only gives moves for current turn player with legalMoves', () => {
    const moves = legalMoves(whiteKingPosition, game);
    expect(moves).toHaveLength(0);
  })
})
