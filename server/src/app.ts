import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware";
import { setupRoutes } from "./routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

app.use(errorHandler);

export default app;
