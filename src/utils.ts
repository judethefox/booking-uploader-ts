import { Booking } from "./types";

const getTimeline = (bookings: Booking[]): string => {
  const bookingSorted = bookings.sort((a, b) => a.startTime - b.startTime);

  const earliestBookingStartInMin = bookingSorted[0].startTime / 60000;

  return bookings.reduce<string>((prevTimeline, booking) => {
    const { startTime, endTime, conflict } = booking;

    const blockInMinute = conflict ? "◩" : "▣";

    const startTimeInMin = startTime / 60000;
    const endTimeInMin = endTime / 60000;

    const gapBetweenBookings = "□".repeat(
      startTimeInMin - earliestBookingStartInMin - prevTimeline.length
    );

    const currentBookingBlock = blockInMinute.repeat(
      endTimeInMin - startTimeInMin
    );

    return `${prevTimeline}${gapBetweenBookings}${currentBookingBlock}`;
  }, "");
};

const getNewBookingsFromText = (
  text: string,
  existingBookings: Booking[]
): Booking[] => {
  const bookingRows = text.split("\n");
  bookingRows.shift();

  return bookingRows.reduce<Booking[]>((result, row) => {
    if (!row) return result;

    const newBooking = row.split(",");

    const startTime = Date.parse(newBooking[0]);
    const durationInMins = parseInt(newBooking[1]);
    const endTime = new Date(startTime + durationInMins * 60000).getTime();
    const userId = newBooking[2].trim();

    return [
      ...result,
      {
        startTime,
        endTime,
        userId,
        conflict: isBookingInConflict(startTime, endTime, existingBookings),
      },
    ];
  }, []);
};

const isBookingInConflict = (
  startTime: number,
  endTime: number,
  existingBookings: Booking[]
): boolean =>
  !!existingBookings.find((existingBooking) => {
    const { startTime: existingStart, endTime: existingEnd } = existingBooking;
    const isStartTimeInConflict =
      existingStart >= startTime && existingStart <= endTime;
    const isEndTimeInConflict =
      existingEnd >= startTime && existingEnd <= endTime;

    return isStartTimeInConflict || isEndTimeInConflict;
  });

export { getTimeline, getNewBookingsFromText, isBookingInConflict };
