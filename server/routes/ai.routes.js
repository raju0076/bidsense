import express from "express"
import { createRFP, getAllRFP } from "../controllers/ai.controller.js"
import {AssignVendors, getSingleRfp} from "../controllers/rfp.controller.js"
import { aiCompareProposals } from "../controllers/aiCompare.controller.js"
const RFPRouter = express.Router()

RFPRouter.post("/create-rfp",createRFP)
RFPRouter.get("/rfp/all", getAllRFP);
RFPRouter.post("/select-vendors/:id",AssignVendors)
RFPRouter.get("/rfp/:id",getSingleRfp)
RFPRouter.post("/ai/compare-proposals/:rfpId",aiCompareProposals)
export default RFPRouter;