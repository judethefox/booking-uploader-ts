import React from "react";
import "./BookingRow.css";
import { Booking } from "./types";
import { getTimeline } from "./utils";

const BookingRow: React.VFC<{ bookings: Booking[] }> = ({ bookings }) => {
  const timeline = getTimeline(bookings);

  return (
    <div
      className="booking-row"
      dangerouslySetInnerHTML={{ __html: timeline }}
    />
  );
};

export default BookingRow;
