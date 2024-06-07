import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import park from "./controllers/park";
import swagger from "@elysiajs/swagger";

export const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Parking App",
          version: "1.0.0",
          description:
            "an App that created for completing OCA Indonesia Test Backend",
        },
      },
    })
  )
  .use(park)
  .get("/", () => ({
    message: "API is Running! 🔥",
  }))
  .listen(process.env.PORT!);

console.group("🦊 Server is running fast on");
console.log(`${app.server?.url}`);
console.write("\n");
console.log(`You can open the documentation in your browser: ${app.server?.url}swagger`);
console.groupEnd();
