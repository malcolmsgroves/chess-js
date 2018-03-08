import createGame, { COLORS, TYPE, piece } from './pieces';

it('creates a new chess game', () => {
  const game = createGame();
  const blackKing = piece(TYPE.KING, COLORS.BLACK);
  const whiteKnight = piece(TYPE.KNIGHT, COLORS.WHITE);
  expect(game.turn).toBe(COLORS.WHITE);
  expect(game.selectedPosition).toBeNull();
  expect(game.highlightedMoves).toHaveLength(0);
  expect(game.inCheck).not.toBeTruthy();

  expect(game.board[0][4]).toEqual(blackKing);
  expect(game.board[7][1]).toEqual(whiteKnight);
})
