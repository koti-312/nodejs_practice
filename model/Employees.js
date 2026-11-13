import { DataTypes, Sequelize } from "sequelize";
import database from "../db.js";

const employees = database.define("Employees", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        required:true
    },
    developer: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }
}, {
    timestamps: true
}
)

export default employees