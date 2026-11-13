import { deleteTripDetails, getTripController, startTripController, tripController, updateTripController } from "../controller/tripController.js"
import { requireAuth } from "../hooks/requireAuth.js"

const tripRoute = async (app) => {
    app.addHook("preHandler",requireAuth)
    app.post("/trip", tripController)
    app.post("/trip/:id/start",startTripController)
    app.get("/trip", getTripController)
    app.put("/trip/:id", updateTripController)
    app.delete("/trip/:id", deleteTripDetails)
}

export default tripRoute