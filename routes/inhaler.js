import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { addInhaler,  deletePuffUsage, getInhalerDetails, recordPuffUsage, } from "../controllers/inhaler.js";



//Create a router
const inhalerRouter = Router();


//Define routes

inhalerRouter.post('/inhalers', isAuthenticated, hasPermission('post_inhaler_medication'),  addInhaler);

// inhalerRouter.get('/inhalers', getPuffUsage);

// inhalerRouter.get('/inhalers/count', countPuffUsage);

inhalerRouter.patch('/inhalers/:id', isAuthenticated, hasPermission('post_puff_usage'), recordPuffUsage);

inhalerRouter.delete('/inhalers/:id', isAuthenticated, hasPermission('delete_puff_usage_id'), deletePuffUsage);

// inhalerRouter.post('/puffs-usage', isAuthenticated,hasPermission('post_puff_usage'), recordPuffUsage);

inhalerRouter.get('/inhalers/:inhalerId', isAuthenticated,hasPermission('get_puff_usage_id'), getInhalerDetails);







//Export Router
export default inhalerRouter;

