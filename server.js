import "dotenv/config"
import fastify from "fastify"
import database from "./db.js"
import tripRoute from "./routes/tripRoute.js"
import cookie from "@fastify/cookie"
import session from "@fastify/session"
import { userRoutes } from "./routes/userRoutes.js"
import { employeesRoute } from "./routes/employeesRoute.js"

const PORT = process.env.PORT || 4000

const app = new fastify({
    logger: true
})


app.get("/", (request, reply) => {
    reply.send("Fastify is running successfully")
})

await app.register(cookie, {
    secret: process.env.COOKIES_SECRET
})

await app.register(session, {
    secret: process.env.SESSION_SECRET,
    cookieName: process.env.SESSION_COOKIES_NAME,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: Number(process.env.SESSION_MAX_AGE)
    },
    saveUninitialized: false
})

await app.register(userRoutes, {
    prefix:"/api/user"
})

await app.register(tripRoute, {
    prefix: "/api/route"
})

await app.register(employeesRoute,{
    prefix:"/api/texve"
})

const startserver = async () => {
    try {
        await database.authenticate()
        app.log.info("PostgreSQL database connected successfully")
        await database.sync({alter:true})
        await app.listen({ port: PORT, host: "127.0.0.1" })
        console.log(`Server running on http://localhost:${PORT}`)
    }
    catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}
startserver()
