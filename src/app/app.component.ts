import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Seat } from './seat.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NgFor, NgClass]
})
export class AppComponent {
  seats: Seat[] = [];
  rows = 12; // 11 rows of 7 seats + 1 row of 3 seats (80 seats total)
  columns = 7;
  lastRowSeats = 3;

  constructor() {
    this.initializeSeats();
  }

  initializeSeats() {
    let id = 1;
    for (let i = 0; i < this.rows; i++) {
      const colCount = i === this.rows - 1 ? this.lastRowSeats : this.columns;
      for (let j = 0; j < colCount; j++) {
        this.seats.push({ id: id++, status: 'available' });
      }
    }
  }

  reserveSeats(seatCount: number) {
    seatCount = Number(seatCount);
    if (seatCount < 1 || seatCount > 7) {
      alert('Please enter a number between 1 and 7.');
      return;
    }

    let availableSeats = this.seats.filter(seat => seat.status === 'available');
    if (availableSeats.length < seatCount) {
      alert('Not enough seats available');
      return;
    }

    let bookedSeats: number[] = [];
    for (let i = 0; i < this.rows; i++) {
      const rowSeats = this.seats.slice(i * 7, i * 7 + 7).filter(seat => seat.status === 'available');
      if (rowSeats.length >= seatCount) {
        for (let j = 0; j < seatCount; j++) {
          const seat = rowSeats[j];
          seat.status = 'booked';
          bookedSeats.push(seat.id);
        }
        alert(`Seats booked: ${bookedSeats.join(', ')}`);
        return;
      }
    }

    // If no full row has enough seats, select nearby seats
    for (let seat of this.seats) {
      if (bookedSeats.length === seatCount) break;
      if (seat.status === 'available') {
        seat.status = 'booked';
        bookedSeats.push(seat.id);
      }
    }

    alert(`Seats booked: ${bookedSeats.join(', ')}`);
  }
}
