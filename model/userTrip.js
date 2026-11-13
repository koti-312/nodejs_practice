import { DataTypes } from "sequelize";
import database from "../db.js"

const userTrip = database.define("userTrip", {

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickUp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hours: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    otpHash:{
        type:DataTypes.STRING
    },
    otpExpire:{
        type:DataTypes.DATE
    },
    otpAttempts:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    status:{
        type:DataTypes.ENUM("booked","started","completed","cancelled"),
        defaultValue:"booked"
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false

    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
}
)

export default userTrip