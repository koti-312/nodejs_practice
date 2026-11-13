import User from "../model/User.js"
import bcrypt from "bcryptjs"


export const userRegister = async (request, reply) => {
    try {
        const { name, email, password } = request.body

        if (!name || !email || !password) {
            return reply.code(400).send({
                success: false,
                message: "Username,email and passwords are required"
            })
        }
        const userEmail = await User.findOne({ where: { email } })
        if (userEmail) {
            return reply.code(409).send({
                success: false,
                message: "Email already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return reply.code(201).send({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        })
    }
    catch (error) {
        request.log.error(error)
        return reply.code(500).send({
            success: false,
            message: "Server failed. Please try again..."
        })
    }
}

export const userLogin = async (request, reply) => {

    try {
        const { email, password } = request.body

        if (!email || !password) {
            return reply.code(400).send({
                success: false,
                message: "Email and passwords are required"
            })
        }

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return reply.code(401).send({
                success: false,
                message: "Invalid email or password"
            })
        }

        const comparePassword = await bcrypt.compare(password,user.password)
        if (!comparePassword) {
            return reply.code(404)({
                success: false,
                message: "Invalid password"
            })
        }
        await request.session.regenerate()
        request.session.user = { id: user.id, name: user.name, email: user.email }

        return reply.code(201).send({
            success: true,
            message: "Logged successfully"
        })
    }
    catch (error) {
        request.log.error({err:error})
        return reply.code(500).send({
            success: false,
            message: "Server failed to login"
        })
    }
}

export const updateUsername=async(request,reply)=>{
    try{
        const userId=request.session.user.id
        const{name}=request.body
        if(!name){
            return reply.code(400).send({
                success:false,
                message:"Name is required"
            })
        }
        const updateName=await User.update(
            {name},
            {where:{id:userId}}
        )
            request.session.user={...request.session.user,name}
            return reply.code(200).send({
                success:true,
                updateName,
                message:"username is updated."
            })
    }
    catch(error){
        request.log.error({err:error})
        return reply.code(500).send({
            success:false,
            message:"Failed to update name"
        })
    }
}