import express from "express"
import { createRFP, getAllRFP } from "../controllers/ai.controller.js"
import {AssignVendors} from "../controllers/rfp.controller.js"
const RFPRouter = express.Router()

RFPRouter.post("/create-rfp",createRFP)
RFPRouter.get("/rfp/all", getAllRFP);
RFPRouter.post("/select-vendors/:id",AssignVendors)

export default RFPRouter;