import express from "express";
import { getFirstLastWindow } from "../controllers/windows.js";

const router = express.Router();

/* READ */
router.get("/firstLast", getFirstLastWindow);

export default router;
