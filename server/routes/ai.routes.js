import express from "express"
import { createRFP, getAllRFP } from "../controllers/ai.controller.js"

const RFPRouter = express.Router()

RFPRouter.post("/create-rfp",createRFP)
RFPRouter.get("/rfp/all", getAllRFP);

export default RFPRouter;