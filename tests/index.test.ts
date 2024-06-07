import { app } from "@/src";
import ParkData from "@/src/types/park-data";
import { ParkingLot } from "@/src/types/parking-lots";
import { describe, expect, it } from "bun:test";

console.log("\nRunning Test 🧐... ");

describe("Elysia", () => {
  it("return a response", async () => {
    const response = await app
      .handle(new Request("http://localhost/"))
      .then((res) => res.json());

    expect(response).toEqual({
      message: "API is Running! 🔥",
    });
  });
});

describe("Parking App Core", () => {
  it("show an array of objects from mock data `park_data`", async () => {
    const response = await app
      .handle(new Request("http://localhost/park"))
      .then((res) => res.json());

    expect(response).toBeArrayOfSize(2);
  });
  it("show an array of objects from mock data `parking_lots`", async () => {
    const response = await app
      .handle(new Request("http://localhost/park/lot"))
      .then((res) => res.json());

    expect(response).toBeArrayOfSize(8);
  });

  it("show an array of license plates from mock data `park_data`", async () => {
    const response = await app
      .handle(new Request("http://localhost/park/plates"))
      .then((res) => res.json());

    expect(response).toBeArray();
  });

  it("show a number of total vehicles based on their type", async () => {
    const response = await app
      .handle(new Request("http://localhost/park/count-type/MPV"))
      .then((res) => res.json());

    expect(response).toEqual({ count: 1 });
  });
});

describe("Parking Case", () => {
  it("add a new parking data", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/park/enter-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            license_num: "T4567AA",
            color: "hitam",
            type: "MPV",
          }),
        })
      )
      .then((res) => res.json());

    expect(response).toEqual({
      license_num: "T4567AA",
      parking_lot: expect.any(String),
      date_in: expect.any(String),
    });
  });

  it("has new parking data `T4567AA`", async () => {
    const responseData = await app
      .handle(new Request("http://localhost/park"))
      .then((res) => res.json());
    const responseLot = await app
      .handle(new Request("http://localhost/park/lot"))
      .then((res) => res.json());

    const hasLicenseNum = responseData.find(
      (vehicle: ParkData) => vehicle.license_num === "T4567AA"
    );
    expect(hasLicenseNum).toBeTruthy();

    const hasLot = responseLot.find(
      (lot: ParkingLot) =>
        lot.status === "unavailable" && lot.license_num === "T4567AA"
    );
    expect(hasLot).toBeTruthy();
  });

  it("show total parking price for `T4567AA`", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/park/get-price", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            license_num: "T4567AA",
          }),
        })
      )
      .then((res) => res.json());

    expect(response).toEqual({
      license_num: "T4567AA",
      total_price: expect.any(Number),
    });
  });

  it("vehicle can exit", async () => {
    const response = await app
      .handle(
        new Request("http://localhost/park/enter-out", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            license_num: "T4567AA",
          }),
        })
      )
      .then((res) => res.json());

    expect(response).toEqual({
      license_num: "T4567AA",
      date_in: expect.any(String),
      date_out: expect.any(String),
      total_price: expect.any(Number),
    });
  });

  it("dont have vehicle `T4567AA` in parking lot", async () => {
    const response = await app
      .handle(new Request("http://localhost/park/lot"))
      .then((res) => res.json());

    const hasLicenseNum = response.find(
      (lot: ParkingLot) =>
        lot.status === "unavailable" && lot.license_num === "T4567AA"
    );
    expect(hasLicenseNum).toBeFalsy();
  });

  it("parking data for `T4567AA` has date_out", async () => {
    const response = await app
      .handle(new Request("http://localhost/park"))
      .then((res) => res.json());

    const hasLicenseNum = response.find(
      (vehicle: ParkData) =>
        vehicle.license_num === "T4567AA" && vehicle.date_out !== null
    );
    expect(hasLicenseNum).toBeTruthy();
  });
});
