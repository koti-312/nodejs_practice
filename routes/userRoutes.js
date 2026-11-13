import { updateUsername, userLogin, userRegister } from "../controller/userControler.js"
import { requireAuth } from "../hooks/requireAuth.js"

export const userRoutes = async(app) => {

    app.post("/register", userRegister)
    app.post("/login", userLogin)

    app.post("/logout",{preHandler:requireAuth}, async (request, reply) => {

        await request.session.destroy()
        reply.clearCookie(process.env.SESSION_COOKIES_NAME, { path: "/" })
        return reply.code(201).send({
            success: true,
            message: "User loggedOut"
        })
    })

    app.get("/profile",{preHandler:requireAuth},async (request, reply) => {
        return reply.code(201).send({
            success: true,
            user:request.session.user
        })
    })
    app.put("/profile",{preHandler:requireAuth},updateUsername)
}
