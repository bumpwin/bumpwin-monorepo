import { OpenAPIHono } from "@hono/zod-openapi";
import { battleroundsApi } from "./battlerounds";
import { championsApi } from "./champions";
import { devChatApi } from "./chat";
import { mockdataApi } from "./mockdata";
import { mockpriceApi } from "./mockprice";

// Create the main API app using OpenAPIHono
const app = new OpenAPIHono()
  .route("/battlerounds", battleroundsApi)
  .route("/champions", championsApi)
  .route("/chat", devChatApi)
  .route("/mockprice", mockpriceApi)
  .route("/mockdata", mockdataApi) // OpenAPIHono endpoints
  .get("/health", (c) => {
    return c.json({ status: "ok" });
  });

// TODO: Add OpenAPI documentation once proper types are resolved
// app.doc("/openapi.json", {
//   openapi: "3.0.0",
//   info: {
//     version: "1.0.0",
//     title: "BUMPWIN API",
//     description: "API for BUMPWIN meme coin battle platform with OpenAPI support",
//   },
//   servers: [
//     {
//       url: "http://localhost:3000",
//       description: "Development server",
//     },
//   ],
// });

// Ensure proper type inference for both legacy and OpenAPI versions
type App = typeof app;
export type AppType = App;
export default app;
