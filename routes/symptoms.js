import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { addSymptom, countSymptoms, deleteSymptomEntry, getOneSymptom, getSymptoms, updateSymptomEntry } from "../controllers/symptoms.js";



//Create a router
const symptomRouter = Router();

//Define routes

symptomRouter.post('/symptoms', isAuthenticated, hasPermission('post_symptoms'),  addSymptom);

symptomRouter.get('/symptoms', getSymptoms);

symptomRouter.get('/symptoms/count', countSymptoms);

symptomRouter.get('/symptoms/:id', getOneSymptom);

symptomRouter.patch('/symptoms/:id', isAuthenticated, hasPermission('update_symptoms'), updateSymptomEntry);

symptomRouter.delete('/symptoms/:id', isAuthenticated, hasPermission('delete_symptoms'), deleteSymptomEntry);





//Export Router
export default symptomRouter;