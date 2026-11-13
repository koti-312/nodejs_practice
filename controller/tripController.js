import "dotenv/config"
import { randomInt } from "node:crypto"
import User from "../model/User.js"
import userTrip from "../model/userTrip.js"
import bcrypt from "bcryptjs"

export const tripController = async (request, reply) => {
    try {
        const userId=request.session.user.id
        const { pickUp, destination,hours, startDate, endDate } = request.body

        if(!pickUp||!destination|| !hours||!startDate||!endDate){
            return reply.code(400).send({
                success:false,
                message:"trips fields are required"
            })
        }
        const enterOtp=String(randomInt(1000,10000))
        const otpHash=await bcrypt.hash(enterOtp,10)
        const otpExpire=new Date(Date.now()+Number(process.env.OTP_EXPIRES_MINUTES)*60*1000)

        const tripDetails = await userTrip.create({
            userId,
            username:request.session.user.name,
            pickUp, destination,hours, startDate, endDate,
            otpHash,otpExpire
        })
        return reply.code(201).send({
            success: true,
            tripDetails,
            enterOtp
        })
    }
    catch (error) {
        request.log.error({ err: error })
        return reply.code(500).send({
            success: false,
            message: "Failed to post trip"
        })
    }
}

export const getTripController = async (request, reply) => {
    try {
        const userId=request.session.user.id
        const tripDetails = await userTrip.findAll({
            where:{userId},
            attributes:{exclude:["otpHash","otpExpire","otpAttempts"]},
            include: [{
                model: User,
                attributes: ["id","name","email"]
            }]
        })
        return reply.code(200).send({
            success: true,
            tripDetails
        })
    }
    catch (error) {
        request.log.error({ err: error })
        return reply.code(500).send({
            success: false,
            message: "Failed to get trips"
        })
    }
}

export const updateTripController = async (request, reply) => {
    try {
        const userId=request.session.user.id
        const {pickUp, destination,hours } = request.body

        const updateTrips = await userTrip.update(
            {pickUp, destination,hours},
            { where: { id: request.params.id,userId}}
        )
        if (updateTrips[0] === 0) {
            return reply.code(404).send({
                success: false,
                message: "Update trips not found"
            })
        }
        return reply.code(200).send({
            success: true,
            updateTrips
        })
    }
    catch (error) {
        request.log.error({ err: error })
        return reply.code(500).send({
            success: false,
            message: "Failed to update trips"
        })
    }
}

export const deleteTripDetails = async (request, reply) => {
    try {
        const userId=request.session.user.id
        const deleteTrips = await userTrip.destroy({
            where: { id: request.params.id,userId}
        })
        if (!deleteTrips) {
            return reply.code(404).send({
                success: false,
                message: "Trips not found"
            })
        }
        return reply.code(200).send({
            success: true,
            deleteTrips
        })
    }
    catch (error) {
        request.log.error({ err: error })
        return reply.code(500).send({
            success: false,
            message: "Failed to delete trips"
        })
    }
}

export const startTripController=async(request,reply)=>{
    try{
        const {OTP}=request.body
    if(!OTP){
        return reply.code(400).send({
            success:false,
            message:"OTP is required"
        })
    }
    const trip=await userTrip.findOne({
        where:{id:request.params.id}
    })
    if(!trip){
        return reply.code(404).send({
            success:false,
            message:"Trips not found"
        })
    }
    
    if(trip.status!=="booked"){
        return reply.code(400).send({
            success:false,
            message:`Trip is already ${trip.status}`
        })
    }
    if(trip.otpAttempts>=process.env.OTP_ATTEMPTS){
        return reply.code(400).send({
            success:false,
            message:"Too many attempts.Please try again after 5 minutes"
        })
    }
    const compareOTP=await bcrypt.compare(String(OTP),trip.otpHash)
    if(!compareOTP){
        await trip.increment("otpAttempts")
        return reply.code(400).send({
            success:false,
            message:"Invalid OTP"
        })
    }

    const statusTrip=await trip.update({status:"started"})
    return reply.code(200).send({
        success:true,
        statusTrip,
        message:"Trip Started"
    })
    }
    catch(error){
        request.log.error({err:error})
        return reply.code(500).send({
            success:false,
            message:"Trip is failed to book"
        })
    }
}