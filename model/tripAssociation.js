import User from "./User.js"
import userTrip from "./userTrip.js"

export const user = () => {

    User.hasMany("userTrips", {
        foreignKey: "userId",
        as: "Trips"
    })
}

export const trip = () => {
    userTrip.belongsTo("Trip", {
        foreignKey: "userId",
        as: "user"
    })
}

