export type Booking = {
  startTime: number;
  endTime: number;
  userId: string;
  conflict?: boolean;
};
