export type ParkData = {
  license_num: string;
  color: string;
  type: "SUV" | "MPV";
  parking_lot: string;
  date_in: Date;
  date_out: Date | null;
  price: number | null;
};

export default ParkData;
