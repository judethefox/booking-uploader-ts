import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import "./App.css";
import BookingRow from "./BookingRow";
import { Booking } from "./types";
import { getNewBookingsFromText } from "./utils";

const apiUrl = "http://localhost:3001";

export const App = () => {
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [newBookings, setNewBookings] = useState<Booking[]>([]);

  const bookingsApiUrl = `${apiUrl}/bookings`;

  useEffect(() => {
    fetch(bookingsApiUrl)
      .then((response) => response.json())
      .then(setExistingBookings);
  }, []);

  const handleSubmit = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBookings),
    };
    fetch(bookingsApiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setExistingBookings(data);
        setNewBookings([]);
      });
  };

  const onDrop = (files: File[]) => {
    const csv = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;

      if (!text || typeof text !== "string") return;

      const newBookings = getNewBookingsFromText(text, existingBookings);
      setNewBookings(newBookings);
    };
    reader.readAsText(csv);
  };

  return (
    <div className="App">
      <div className="App-header">
        <Dropzone accept=".csv" onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      <div>
        <p>Existing bookings:</p>
        <p>
          {existingBookings.length && (
            <BookingRow bookings={existingBookings} />
          )}
        </p>

        <p>New bookings:</p>
        <p>
          {newBookings.length ? (
            <>
              <BookingRow bookings={newBookings} />
              <button onClick={handleSubmit}>
                Submit non-conflicting bookings
              </button>
            </>
          ) : (
            "nothing to see here"
          )}
        </p>
      </div>
    </div>
  );
};
