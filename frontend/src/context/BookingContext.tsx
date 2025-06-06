type PreBookingType = {
  flight: any;
  passengers: number;
};

export class PreBookingContext {
  booking: PreBookingType | null = null;

  clearBooking() {
    this.booking = null;
    localStorage.removeItem('booking');
  }

  setFlight(flight: any) {
    if (!this.booking) {
      this.booking = { flight, passengers: 1 };
    } else {
      this.booking.flight = flight;
    }
    localStorage.setItem('booking', JSON.stringify(this.booking));
  }

  // Chỉ gọi khi Booking không null
  updateBooking(booking: Partial<PreBookingType>) {
    this.booking = { ...this.booking!, ...booking };
    localStorage.setItem('booking', JSON.stringify(this.booking));
  }

  
  setBooking(booking: PreBookingType) {
    // luu vao localstorage luon
    this.booking = booking;
    localStorage.setItem('booking', JSON.stringify(booking));
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