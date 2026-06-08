import { ChangeDetectionStrategy, Component, OnDestroy, computed, signal } from '@angular/core';

type Player = 'X' | 'O';
type Cell = Player | '';

const MIN_BOARD_SIZE = 3;
const MAX_BOARD_SIZE = 12;
const WIN_RESET_DELAY_MS = 1200;
const DRAW_RESET_DELAY_MS = 500;

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.css',
})
export class TicTacToeComponent implements OnDestroy {
  protected readonly minBoardSize = MIN_BOARD_SIZE;
  protected readonly maxBoardSize = MAX_BOARD_SIZE;
  protected readonly boardSizeInput = signal(String(MIN_BOARD_SIZE));
  protected readonly boardSize = signal(MIN_BOARD_SIZE);
  protected readonly board = signal<Cell[][]>(this.createBoard(MIN_BOARD_SIZE));
  protected readonly currentPlayer = signal<Player>('X');
  protected readonly winnerMessage = signal('');
  protected readonly gridTemplate = computed(() => `repeat(${this.boardSize()}, minmax(0, 1fr))`);

  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    this.clearResetTimeout();
  }

  protected onSizeInput(event: Event): void {
    this.boardSizeInput.set((event.target as HTMLInputElement).value);
  }

  protected startGame(): void {
    const requestedSize = Number(this.boardSizeInput());

    if (
      !Number.isInteger(requestedSize) ||
      requestedSize < MIN_BOARD_SIZE ||
      requestedSize > MAX_BOARD_SIZE
    ) {
      return;
    }

    this.boardSize.set(requestedSize);
    this.resetBoard();
  }

  protected play(rowIndex: number, cellIndex: number): void {
    if (this.board()[rowIndex][cellIndex] || this.winnerMessage()) {
      return;
    }

    const player = this.currentPlayer();
    this.board.update((currentBoard) =>
      currentBoard.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((cell, currentCellIndex) => (currentCellIndex === cellIndex ? player : cell))
          : row,
      ),
    );

    if (this.hasWinner(player)) {
      this.winnerMessage.set(`${player} wins!`);
      this.scheduleReset(WIN_RESET_DELAY_MS);
      return;
    }

    if (this.isBoardFull()) {
      this.scheduleReset(DRAW_RESET_DELAY_MS);
      return;
    }

    this.currentPlayer.set(player === 'X' ? 'O' : 'X');
  }

  private resetBoard(): void {
    this.clearResetTimeout();
    this.board.set(this.createBoard(this.boardSize()));
    this.currentPlayer.set('X');
    this.winnerMessage.set('');
  }

  private scheduleReset(delay: number): void {
    this.clearResetTimeout();
    this.resetTimeoutId = setTimeout(() => {
      this.resetBoard();
      this.resetTimeoutId = null;
    }, delay);
  }

  private createBoard(size: number): Cell[][] {
    return Array.from({ length: size }, () => Array<Cell>(size).fill(''));
  }

  private hasWinner(player: Player): boolean {
    const currentBoard = this.board();
    const size = this.boardSize();
    const hasWinningRow = currentBoard.some((row) => row.every((cell) => cell === player));
    const hasWinningColumn = currentBoard.some((_, columnIndex) =>
      currentBoard.every((row) => row[columnIndex] === player),
    );
    const hasLeftDiagonal = currentBoard.every((row, index) => row[index] === player);
    const hasRightDiagonal = currentBoard.every((row, index) => row[size - 1 - index] === player);

    return hasWinningRow || hasWinningColumn || hasLeftDiagonal || hasRightDiagonal;
  }

  private isBoardFull(): boolean {
    return this.board().every((row) => row.every(Boolean));
  }

  private clearResetTimeout(): void {
    if (this.resetTimeoutId !== null) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
  }
}
