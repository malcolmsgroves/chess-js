// piece types with HMTL $#{codes}; for white pieces, add 6 for black
const TYPE = {
  KING:   'KING',
  QUEEN:  'QUEEN',
  ROOK:   'ROOK',
  BISHOP: 'BISHOP',
  KNIGHT: 'KNIGHT',
  PAWN:   'PAWN',
};

const COLORS = {
  BLACK: 'BLACK',
  WHITE: 'WHITE',
}

const CHESS_HTML = {
  WHITE: {
    KING:   '\u2654',
    QUEEN:  '\u2655',
    ROOK:   '\u2656',
    BISHOP: '\u2657',
    KNIGHT: '\u2658',
    PAWN:   '\u2659',
  },
  BLACK: {
    KING:   '\u265A',
    QUEEN:  '\u265B',
    ROOK:   '\u265C',
    BISHOP: '\u265D',
    KNIGHT: '\u265E',
    PAWN:   '\u265F',
  }
}

function createGame() {
  return {
    board:              newBoard(),
    turn:               COLORS.WHITE,
    highlightedMoves:   [],
    selectedPosition:   null,
    inCheck:            false,
  };
}

function piece(type, color) {
  return { type, color }
}

function position(row, col) {
  return { row, col }
}

function pieceToHTML(piece) {
  if(piece === null) return null;
  return CHESS_HTML[piece.color][piece.type];
}

function newBoard() {
  let board = [];
  for(let i = 0; i < 8; ++i) {
    board.push(new Array(8).fill(null));
  }
  const BACK_ROW = [TYPE.ROOK, TYPE.KNIGHT, TYPE.BISHOP, TYPE.QUEEN,
                    TYPE.KING, TYPE.BISHOP, TYPE.KNIGHT, TYPE.ROOK];
  for(let i = 0; i < 8; ++i) {
    board[1][i] = piece(TYPE.PAWN, COLORS.BLACK);
    board[6][i] = piece(TYPE.PAWN, COLORS.WHITE);
  }
  for(let row = 0; row < 8; row += 7) {
    const COLOR = (row === 0) ? COLORS.BLACK : COLORS.WHITE;
    for(let col = 0; col < 8; ++col) {
      board[row][col] = piece(BACK_ROW[col], COLOR);
    }
  }
  return board;
}

export default createGame;
export { TYPE, COLORS, pieceToHTML, position };
