import ParkData from "./park-data";

export type ParkingLot = {
    name: string;
} & (AvailableLot | UnavailableLot);

type AvailableLot = {
    status: 'available'
}

type UnavailableLot = {
    status: 'unavailable';
    license_num: string
}

