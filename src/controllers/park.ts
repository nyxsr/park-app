import { Context} from "elysia";
import ParkData from "../types/park-data";
import { park_data, parking_lots } from "../mock/datas";
import moment from "moment-timezone";
import { price } from "../constants";

class Park {
  private _body: Partial<ParkData>;
  private _context: unknown;
  private _params: unknown;
  private _query: unknown;
  constructor(context: Omit<Context, "params"> & { params: unknown }) {
    this._body = context.body as Partial<ParkData>;
    this._params = context.params;
    this._context = context;
    this._query = context.query;
  }

  async enterIn() {
    const context = this._context as unknown as Context;
    const { license_num, color, type } = this._body;

    if (!license_num || !color || !type) {
      context.set.status = "Bad Request";
      throw new Error("Missing required fields");
    }

    const checkVehicle = park_data.find(
      (vehicle) =>
        vehicle.license_num === license_num && vehicle.date_out === null
    );

    if (checkVehicle) {
      context.set.status = "Bad Request";
      throw new Error("Vehicle is already parked");
    }

    const availableLot = parking_lots.find((lot) => lot.status === "available");

    if (!availableLot) {
      context.set.status = "Bad Request";
      throw new Error("Parking lot is not available");
    }

    park_data.push({
      license_num,
      color,
      type,
      parking_lot: availableLot.name,
      date_in: new Date(),
      date_out: null,
      price: null,
    });

    const parkingLot = parking_lots.findIndex(
      (lot) => lot.name === availableLot.name
    );

    if (parkingLot !== -1) {
      parking_lots[parkingLot] = {
        ...parking_lots[parkingLot],
        status: "unavailable",
        license_num,
      };
    } else {
      context.set.status = "Internal Server Error";
      throw new Error(`Parking Lot ${availableLot.name} not found`);
    }

    context.set.status = "OK";
    return {
      license_num,
      parking_lot: availableLot.name,
      date_in: new Date(),
    };
  }

  async enterOut() {
    const context = this._context as unknown as Context;
    const { license_num } = this._body;

    if (!license_num) {
      context.set.status = "Bad Request";
      throw new Error("Missing required fields");
    }

    const vehicle = park_data.find(
      (vehicle) =>
        vehicle.license_num === license_num && vehicle.date_out === null
    );

    if (!vehicle) {
      context.set.status = "Bad Request";
      throw new Error("Vehicle is not parked");
    }

    // Get diff between time now and vehicle.date_in
    const diff = moment
      .duration(moment().diff(moment(vehicle.date_in)))
      .asHours();

    const priceByDuration = this._priceByDuration(diff, price[vehicle.type]);
    vehicle.date_out = new Date();
    vehicle.price = priceByDuration;

    const parkingLot = parking_lots.findIndex(
      (lot) => lot.name === vehicle.parking_lot
    );

    if (parkingLot !== -1) {
      parking_lots[parkingLot] = {
        name: vehicle.parking_lot,
        status: "available",
      };
    } else {
      context.set.status = "Internal Server Error";
      throw new Error(`Parking Lot ${vehicle.parking_lot} not found`);
    }

    context.set.status = "OK";
    return {
      license_num,
      date_in: vehicle.date_in,
      date_out: vehicle.date_out,
      total_price: priceByDuration,
    };
  }

  async getPrice() {
    const context = this._context as unknown as Context;
    let total_price = 0;
    const { license_num } = this._body;

    if (!license_num) {
      context.set.status = "Bad Request";
      throw new Error("Missing required fields");
    }

    const vehicle = park_data.find(
      (vehicle) =>
        vehicle.license_num === license_num && vehicle.date_out === null
    );

    if (!vehicle) {
      context.set.status = "Bad Request";
      throw new Error("Vehicle is not parked");
    }

    // Get diff between time now and vehicle.date_in
    const diff = moment
      .duration(moment().diff(moment(vehicle.date_in)))
      .asHours();

    const priceByDuration = this._priceByDuration(diff, price[vehicle.type]);
    total_price = priceByDuration;

    context.set.status = "OK";
    return {
      license_num,
      total_price,
    };
  }

  async getLots() {
    const query = this._query as unknown as { availableOnly: string };

    if (query.availableOnly === "true" || query.availableOnly === "1") {
      return parking_lots.filter((lot) => lot.status === "available");
    }
    return parking_lots;
  }

  async countPerType() {
    const params = this._params as unknown as { type: "SUV" | "MPV" };
    if (
      params === undefined ||
      params.type === undefined ||
      typeof params !== "object"
    ) {
      throw new Error("Query parameter is required");
    }
    const { type } = params;
    const vehicles = park_data.filter((vehicle) => vehicle.date_out === null);

    if (type !== "SUV" && type !== "MPV") {
      throw new Error("Type must be SUV or MPV");
    }

    const count = vehicles.filter((vehicle) => vehicle.type === type).length;
    return {
      count,
    };
  }

  async getLicensePlates() {
    const query = this._query as unknown as { currentOnly?: string; color?: string; type?: string };
    const isCurrentOnly = query.currentOnly === "true" || query.currentOnly === "1";
    const vehicles = park_data.filter((vehicle) => {
      if (isCurrentOnly) {
        return vehicle.date_out === null;
      }
      return true;
    });

    const filtered = vehicles.filter((vehicle) => {
      const matchesColor = query.color ? vehicle.color === query.color : true;
      const matchesType = query.type ? vehicle.type === query.type : true;
      return matchesColor && matchesType;
    });

    const plates = filtered.map((vehicle) => vehicle.license_num);
    return Array.from(new Set(plates));
  }

  async getParkData() {
    return park_data;
  }

  _priceByDuration(diffHours: number, price: number) {
    if (diffHours < 1) {
      return Number((price * diffHours).toFixed(0));
    } else {
      const hours = Math.floor(diffHours);
      const extendedPrice = price * (20 / 100);
      const totalExtended = hours - 1; // for first hour has different price
      const priceExtended = totalExtended * extendedPrice;
      return price + priceExtended;
    }
  }
}
export default Park;
