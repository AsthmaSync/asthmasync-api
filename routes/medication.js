import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { addMedication, countMedication, deleteMedication, getMedication, getOneMedication, updateMedication } from "../controllers/medication.js";



//Create a router
const medicationRouter = Router();

//Define routes

medicationRouter.post('/medications', isAuthenticated, hasPermission('post_medication'),  addMedication);

medicationRouter.get('/medications', getMedication);

medicationRouter.get('/medications/count', countMedication);

medicationRouter.get('/medications/:id', getOneMedication);

medicationRouter.patch('/medications/:id', isAuthenticated, hasPermission('update_medication'), updateMedication);

medicationRouter.delete('/medications/:id', isAuthenticated, hasPermission('delete_medication'), deleteMedication);





//Export Router
export default medicationRouter;