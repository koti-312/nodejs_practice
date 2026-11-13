
export const requireAuth=async(request,reply)=>{
    if(!request.session.user){
        return reply.code(401).send({
            success:false,
            message:"Please login..."
        })
    }
}