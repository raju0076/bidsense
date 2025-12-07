import express from "express";
import {  getProposalById, getProposalsByRfp } from "../controllers/proposal.controller.js";


const ProposalRouter = express.Router()


ProposalRouter.get('/:rfId',getProposalsByRfp)
ProposalRouter.get("/single-proposal/:proposalId",getProposalById)


export default ProposalRouter;