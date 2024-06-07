import Elysia, { Context, t } from "elysia";
import Park from "../controllers/park";

const park = new Elysia({ prefix: "/park" })
  .get("/", async (context) => await new Park(context).getParkData(), {
    detail: {
      summary: "Get Parking Data",
      tags: ["Parking"],
    },
  })
  .get("/lot", async (context) => await new Park(context).getLots(), {
    detail: {
      summary: "Get Parking Lots Data",
      tags: ["Parking"],
    },
  })
  .get(
    "/count-type/:type",
    async (context) => await new Park(context).countPerType(),
    {
      params: t.Object(
        {
          type: t.String(),
        },
        {
          description: "Please provide type",
        }
      ),
      detail: {
        summary: "Count vehicles based on their type",
        tags: ["Parking"],
      },
    }
  )
  .get(
    "/plates",
    async (context) => await new Park(context).getLicensePlates(),
    {
      query: t.Object(
        {
          currentOnly: t.Optional(t.String()),
          color: t.Optional(t.String()),
          type: t.Optional(t.String()),
        },
        {
          description: "Please provide color and type",
        }
      ),
      detail: {
        summary: "Get license plates based on color and type",
        tags: ["Parking"],
      },
    }
  )
  .post("/get-price", async (context) => await new Park(context).getPrice(), {
    body: t.Object(
      {
        license_num: t.String(),
      },
      {
        description: "Please provide license number",
      }
    ),
    detail: {
      summary: "Get price based how long the vehicle is parked",
      tags: ["Parking"],
    },
  })
  .post("/enter-in", async (context) => await new Park(context).enterIn(), {
    body: t.Object(
      {
        license_num: t.String(),
        color: t.String(),
        type: t.String(),
      },
      {
        description: "Please provide all required fields",
      }
    ),
    detail: {
      summary: "Car is entering the parking lot",
      tags: ["Parking"],
    },
  })
  .post("/enter-out", async (context) => await new Park(context).enterOut(), {
    body: t.Object(
      {
        license_num: t.String(),
      },
      {
        description: "Please provide license number",
      }
    ),
    detail: {
      summary: "Car is leaving the parking lot",
      tags: ["Parking"],
    },
  });

export default park;
