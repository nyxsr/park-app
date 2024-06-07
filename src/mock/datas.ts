import ParkData from "../types/park-data";
import { ParkingLot } from "../types/parking-lots";

export const park_data: ParkData[] = [
  {
    license_num: "B8999AE",
    color: "merah",
    type: "SUV",
    parking_lot: "A2",
    date_in: new Date("2024-06-07T15:00:31.134Z"),
    date_out: null,
    price: null
  },
  {
    license_num: "T2345AA",
    color: "hitam",
    type: "MPV",
    parking_lot: "A4",
    date_in: new Date("2024-06-07T07:00:00.000Z"),
    date_out: null,
    price: null
  },
];

export const parking_lots: ParkingLot[] = [
  {
    name: "A1",
    status: "available",
  },
  {
    name: "A2",
    status: "unavailable",
    license_num: "B8999AE",
  },
  {
    name: "A3",
    status: "available",
  },
  {
    name: "A4",
    status: "unavailable",
    license_num: "T2345AA",
  },
  {
    name: "A5",
    status: "available",
  },
  {
    name: "A6",
    status: "available",
  },
  {
    name: "A7",
    status: "available",
  },
  {
    name: "A8",
    status: "available",
  }
]
