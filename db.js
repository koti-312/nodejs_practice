import "dotenv/config"
import { Sequelize } from "sequelize";

const database = new Sequelize({
    username: process.env.DB_Username,
    password: process.env.DB_Password,
    host: process.env.DB_Host,
    port: process.env.DB_Port,
    database: process.env.DB_Database,
    dialect: "postgres"
})

export default database