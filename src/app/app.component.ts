import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from './services/alert/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  noOfRows = 9;
  noOfColumns = 9;
  noOfMines = 10;
  rows = Array(this.noOfRows).fill(0);
  columns = Array(this.noOfColumns).fill(0);
  @ViewChild('board') minesweeperBoard?: HTMLTableElement;
  title = 'minesweeper';
  table: any = null;
  gameStarted = false;
  firstMineLocationn = [];
  showMines = false;
  movesLeft = this.noOfColumns * this.noOfRows - this.noOfMines;
  constructor(private alert: AlertService) {}
  ngOnInit(): void {
    this.createTableCells();
  }
  ngAfterViewInit(): void {
    this.insertMines();
  }
  createTableCells() {
    this.table = Array(this.noOfRows)
      .fill('')
      .map((x, i) =>
        Array(this.noOfColumns)
          .fill('')
          .map((x, i) => '')
      );
  }
  insertMines() {
    for (let i = 0; i < this.noOfMines; i++) {
      this.addMineToRandomLocation();
    }
    console.table(this.table);
  }
  onClickCell(ev, rowNumber, columnNumber) {
    if (
      this.table[rowNumber][columnNumber] === '' ||
      this.table[rowNumber][columnNumber] === 'mine'
    ) {
      if (!this.gameStarted && this.hasMine(rowNumber, columnNumber)) {
        // clicked on mine for the first time
        this.addMineToRandomLocation();
        this.table[rowNumber][columnNumber] = this.getMinesCount(
          rowNumber,
          columnNumber
        );
        this.movesLeft -= 1;
        console.table(this.table);
      } else if (this.hasMine(rowNumber, columnNumber)) {
        // clicked on mine
        this.gameOver();
      } else {
        // display mines around count
        this.table[rowNumber][columnNumber] = this.getMinesCount(
          rowNumber,
          columnNumber
        );
        this.movesLeft -= 1;
        if (this.movesLeft === 0) {
          this.alert.showAlert('Congratulations', 'You Won!', 'success');
          this.showMines = true;
        }
      }
    }
    this.gameStarted = true;
  }
  addMineToRandomLocation() {
    let row = Math.floor(Math.random() * this.noOfRows);
    let column = Math.floor(Math.random() * this.noOfColumns);
    if (this.table[row][column] !== 'mine') {
      this.table[row][column] = 'mine';
    } else {
      this.addMineToRandomLocation();
    }
  }
  gameOver() {
    this.showMines = true;
    this.alert.showAlert('Game Over', 'You Lost!', 'error');
  }
  hasMine(rowNumber: number, columnNumber: number): boolean {
    return this.table[rowNumber][columnNumber] === 'mine';
  }
  getMinesCount(rowNumber: number, columnNumber: number): number {
    // -1 1, 0 1, 1 1
    // -1 0, 0 0 , 1 0
    // -1 -1, 0 -1, 1 -1
    let noOfMines = 0;
    if (
      this.isValidCell(rowNumber - 1, columnNumber + 1) &&
      this.hasMine(rowNumber - 1, columnNumber + 1)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber - 1, columnNumber) &&
      this.hasMine(rowNumber - 1, columnNumber)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber - 1, columnNumber - 1) &&
      this.hasMine(rowNumber - 1, columnNumber - 1)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber, columnNumber + 1) &&
      this.hasMine(rowNumber, columnNumber + 1)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber, columnNumber - 1) &&
      this.hasMine(rowNumber, columnNumber - 1)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber + 1, columnNumber + 1) &&
      this.hasMine(rowNumber + 1, columnNumber + 1)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber + 1, columnNumber) &&
      this.hasMine(rowNumber + 1, columnNumber)
    ) {
      noOfMines += 1;
    }
    if (
      this.isValidCell(rowNumber + 1, columnNumber - 1) &&
      this.hasMine(rowNumber + 1, columnNumber - 1)
    ) {
      noOfMines += 1;
    }
    return noOfMines;
  }
  isValidCell(x, y) {
    return x >= 0 && x < this.noOfRows && y >= 0 && y < this.noOfColumns;
  }
  resetBoard() {
    this.createTableCells();
    this.insertMines();
    this.showMines = false;
    this.gameStarted = false;
    this.movesLeft = this.noOfColumns * this.noOfRows - this.noOfMines;
  }
}
