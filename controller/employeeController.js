import employees from "../model/Employees.js"

export const employeesData = async (request, reply) => {
   try{
     const { name, email, developer, experience } = request.body

    if (!name || !email || !developer || !experience) {
        return reply.code(404).send({
            success: false,
            message: "Employees details are required"
        })
    }

    const userMail = await employees.findOne({ where: { email } })
    if(userMail){
        return reply.code(401).send({
            success:false,
            message:"Email already registered"
        })
    }
    const user = await employees.create({
        name, email, developer, experience
    })
    return reply.code(201).send({
        success: true,
        user
    })
   }
   catch(error){
    request.log.error({err:error})
    return reply.code(500).send({
        success:false,
        message:"Failed to employees details"
    })
   }
}

export const getEmployeesdata=async(request,reply)=>{
    const{id}=request.query
    const user=await employees.findAll({where:id})

    return reply.code(201).send({
        success:true,
        user
    })
}