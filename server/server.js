import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./configs/mongo.config.js"
dotenv.config()
import cors from "cors"
import RFPRouter from "./routes/ai.routes.js"
import VendorRouter from "./routes/vendor.routes.js"
import EmailRouter from "./routes/email.routes.js"
import ProposalRouter from "./routes/proposal.routes.js"
const app = express()

app.use(cors());



app.use(express.json())

app.use('/api',RFPRouter)
app.use('/api/vendor',VendorRouter)
app.use('/api/email',EmailRouter)
app.use('/api/proposals',ProposalRouter)


connectDB()



const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})
