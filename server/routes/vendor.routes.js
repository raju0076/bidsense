import express from "express"
import { createVendor, deleteVendor, getVendors } from "../controllers/vendor.controller.js"

const VendorRouter = express.Router()

VendorRouter.post("/create-vendors", createVendor)
VendorRouter.get('/getAll-vendors',getVendors)
VendorRouter.delete('/delete-vendor', deleteVendor)


export default VendorRouter