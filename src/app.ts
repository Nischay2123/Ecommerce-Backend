import express  from "express"
import { connectDB } from "./Utils/features.utils.js";
import { errorMiddlerware } from "./Middlewares/error.middleware.js";
import Nodecache from "node-cache"
import { config } from "dotenv";
import morgan from 'morgan'
import cors from "cors";

// importing routes
import userRoute from "./Routes/user.routes.js";
import productRoute from "./Routes/products.routes.js";
import orederRoute from "./Routes/order.routes.js";
import paymentRoute from "./Routes/payment.routes.js";
import dashboardRoute from "./Routes/stats.routes.js";
config({
    path:"./.env"
})


const port = process.env.PORT||3000;
const mongoURI =process.env.MONGO_URI || "";

connectDB(mongoURI)

export const myCache =new Nodecache()
const app = express();
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

app.get("/",(req,res)=>{
    return res.send(`Api is working with api/v1`)
})
app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/order",orederRoute)
app.use("/api/v1/payment",paymentRoute)
app.use("/api/v1/dashboard",dashboardRoute)

app.use(errorMiddlerware)
app.use("/uploads",express.static("uploads"))

app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
    
})