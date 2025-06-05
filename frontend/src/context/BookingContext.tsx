type BookingType = {
  flight: any,
  passengers: number;
};

export class BookingContext {
  booking: BookingType | null = null;

  clearBooking() {
    this.booking = null;
    localStorage.removeItem('booking');
  }

  setBooking(booking: BookingType) {
    // luu vao localstorage luon
    localStorage.setItem('booking', JSON.stringify(booking));
    this.booking = booking;
  }

  getBooking() {
    if (this.booking) {
      return this.booking;
    }
    const booking = localStorage.getItem('booking');
    if (booking) {
      this.booking = JSON.parse(booking);
      return this.booking;
    }
    return null;
  }
}