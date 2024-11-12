import { Router } from "express";
import { addTrigger, countTriggers, deleteTriggerEntry, getOneTrigger, getTriggers, updateTriggerEntry } from "../controllers/triggers.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";


//Create a router
const triggerRouter = Router();

//Define routes

triggerRouter.post('/triggers', isAuthenticated, hasPermission('post_triggers'), addTrigger);

triggerRouter.get('/triggers', getTriggers);

triggerRouter.get('/triggers/count', countTriggers);

triggerRouter.get('/triggers/:id', getOneTrigger);

triggerRouter.patch('/triggers/:id', isAuthenticated, hasPermission('update_triggers'),  updateTriggerEntry);

triggerRouter.delete('/triggers/:id', isAuthenticated, hasPermission('delete_triggers'), deleteTriggerEntry);


//Export Router
export default triggerRouter;