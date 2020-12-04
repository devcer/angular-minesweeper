import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

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
      let row = Math.floor(Math.random() * 10);
      let column = Math.floor(Math.random() * 10);
      this.table[row][column] = 'mine';
    }
    console.table(this.table);
  }
  onClickCell(ev, rowNumber, columnNumber) {
    if (!this.gameStarted) {
      if (this.hasMine(rowNumber, columnNumber)) {
        this.table[rowNumber][columnNumber] = '';
        this.addMineToFirstEmptyLocation();
        console.table(this.table);
      } else {
        this.table[rowNumber][columnNumber] = this.getMinesCount(
          rowNumber,
          columnNumber
        );
      }
      this.gameStarted = true;
    } else {
      if (this.hasMine(rowNumber, columnNumber)) {
        this.gameOver();
        this.showMines = true;
      } else {
        this.table[rowNumber][columnNumber] = this.getMinesCount(
          rowNumber,
          columnNumber
        );
      }
    }
  }
  addMineToFirstEmptyLocation() {
    for (let i = 0; i < this.noOfRows; i++) {
      for (let j = 0; j < this.noOfColumns; j++) {
        if (!this.hasMine(i, j)) {
          this.table[i][j] = 'mine';
          return;
        }
      }
    }
  }
  gameOver() {
    this.showMines = true;
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
  }
}
