import { getTimeline, isBookingInConflict } from "./utils";
import { Booking } from "./types";

type isBookingInConflictDataProvider = {
  newBookingStart: number;
  newBookingEnd: number;
  existingBookings: Booking[];
  expectedInConflict: boolean;
};

type getTimelineDataProvider = {
  bookings: Booking[];
  expectedTimeline: string;
};

it("test getTimeline", () => {
  const dataProvider: getTimelineDataProvider[] = [
    {
      bookings: [
        {
          startTime: Date.parse("01 Mar 2020 11:00:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:03:00 GMT+1000"),
          userId: "0001",
        },
        {
          startTime: Date.parse("01 Mar 2020 11:07:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:09:00 GMT+1000"),
          userId: "0001",
        },
      ],
      expectedTimeline: "▣▣▣□□□□▣▣",
    },
    {
      bookings: [
        {
          startTime: Date.parse("01 Mar 2020 11:00:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:03:00 GMT+1000"),
          userId: "0001",
        },
        {
          startTime: Date.parse("01 Mar 2020 11:07:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:09:00 GMT+1000"),
          userId: "0001",
          conflict: true,
        },
      ],
      expectedTimeline: "▣▣▣□□□□◩◩",
    },
  ];

  dataProvider.forEach((test) => {
    const { bookings, expectedTimeline } = test;
    expect(getTimeline(bookings)).toStrictEqual(expectedTimeline);
  });
});

it("test isBookingInConflict", () => {
  const dataProvider: isBookingInConflictDataProvider[] = [
    {
      newBookingStart: Date.parse("01 Mar 2020 11:04:00 GMT+1000"),
      newBookingEnd: Date.parse("01 Mar 2020 11:06:00 GMT+1000"),
      existingBookings: [
        {
          startTime: Date.parse("01 Mar 2020 11:00:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:03:00 GMT+1000"),
          userId: "0001",
        },
        {
          startTime: Date.parse("01 Mar 2020 11:07:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:09:00 GMT+1000"),
          userId: "0001",
        },
      ],
      expectedInConflict: false,
    },
    {
      newBookingStart: Date.parse("01 Mar 2020 11:02:00 GMT+1000"),
      newBookingEnd: Date.parse("01 Mar 2020 11:07:00 GMT+1000"),
      existingBookings: [
        {
          startTime: Date.parse("01 Mar 2020 11:00:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:03:00 GMT+1000"),
          userId: "0001",
        },
        {
          startTime: Date.parse("01 Mar 2020 11:07:00 GMT+1000"),
          endTime: Date.parse("01 Mar 2020 11:09:00 GMT+1000"),
          userId: "0001",
        },
      ],
      expectedInConflict: true,
    },
  ];

  dataProvider.forEach((test) => {
    const {
      newBookingStart,
      newBookingEnd,
      existingBookings,
      expectedInConflict,
    } = test;
    expect(
      isBookingInConflict(newBookingStart, newBookingEnd, existingBookings)
    ).toStrictEqual(expectedInConflict);
  });
});

export {};
