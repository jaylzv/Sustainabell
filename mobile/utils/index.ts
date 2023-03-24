import { Timestamp } from "firebase/firestore";

export const midnightTimestamp = () =>
  Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));

const date = new Date();
export const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

export const firstDayInPreviousMonth = new Date(
  firstDayOfMonth.getFullYear(),
  firstDayOfMonth.getMonth() - 1,
  1
);
