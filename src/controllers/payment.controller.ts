import { stripe } from "../app.js";
import { TryCatch } from "../Middlewares/error.middleware.js";
import { Coupon } from "../models/Coupon.model.js";
import ErrorHandler from "../Utils/utility-class.js";

export const createPaymentIntent = TryCatch(async(req,res,next)=>{
    const{amount}=req.body

    if ( !amount) {
        return next(new ErrorHandler("Please enter all details",400))
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount:Number(amount)*100,
        currency:"inr"
    })

    return res.status(201).json({
        success:true,
        clientSecret:paymentIntent.client_secret
    })
})

export const newCoupon = TryCatch(async(req,res,next)=>{
    const{coupon,amount}=req.body

    if (!coupon || !amount) {
        return next(new ErrorHandler("Please enter all details",400))
    }

    await Coupon.create({code:coupon,amount})

    return res.status(201).json({
        success:true,
        message:`Counpon ${coupon} created successfully`
    })
})

export const applyDiscount = TryCatch(async(req,res,next)=>{
    const{coupon}=req.query

    const discount= await Coupon.findOne({code:coupon})

    if (!discount) {
        return next(new ErrorHandler("Invalid Coupon",400))
    }

    return res.status(200).json({
        success:true,
        discount:discount.amount
    })
})

export const allCoupon = TryCatch(async(req,res,next)=>{

    const discounts= await Coupon.find({})

    return res.status(200).json({
        success:true,
        discounts
    })
})

export const deleteCoupon = TryCatch(async(req,res,next)=>{

    const {id} = req.params
    const coupon= await Coupon.findByIdAndDelete(id)
    if (!coupon) {
        return next(new ErrorHandler("Invalid Id",400))
    }
    return res.status(200).json({
        success:true,
        message:`Coupon ${coupon?.code} deleted Successfully`
    })
})