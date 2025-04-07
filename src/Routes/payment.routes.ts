import express from "express"
import{allCoupon, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon} from "../controllers/payment.controller.js"
import { adminOnly } from "../Middlewares/auth.middlerware.js"
const app = express()

// route /api/v1/payment/create
app.post("/create",createPaymentIntent)

// route /api/v1/payment/discount
app.get("/discount",applyDiscount)

// route /api/v1/payment/coupon/new
app.post("/coupon/new",adminOnly,newCoupon)

// route /api/v1/payment/coupon/all
app.get("/coupon/all",adminOnly,allCoupon)

// route /api/v1/payment/coupon/:id
app.route("/:id").delete(adminOnly,deleteCoupon)

export default app
