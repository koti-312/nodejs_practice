import { employeesData, getEmployeesdata } from "../controller/employeeController.js"


export const employeesRoute = (app) => {
    app.post("/employee",employeesData)
    app.get("/employee/:id",getEmployeesdata)
    app.get("/employee",getEmployeesdata)
}
