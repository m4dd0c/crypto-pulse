import express from "express";
import { downloadReport, health, priceHistory } from "../controller/index";
const router = express.Router();

router.route("/api/v1/health").get(health);
router.route("/api/v1/price-history/:symbol").get(priceHistory);
router.route("/api/v1/download-report").get(downloadReport);

export const setupRoutes = (app: express.Application) => {
  app.use("/", router);
};
