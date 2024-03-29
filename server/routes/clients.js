import express from "express";
import { getClientsByTime } from "../controllers/clients.js";

const router = express.Router();

/* READ */
router.get("/:windowStart", getClientsByTime);

export default router;
