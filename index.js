import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js"; 
import { mailtransporter } from "./utils/mail.js";
import triggerRouter from "./routes/triggers.js";
import symptomRouter from "./routes/symptoms.js";
import medicationRouter from "./routes/medication.js";
import inhalerRouter from "./routes/inhaler.js";
import sendNotifications from './utils/notification.js';




//Connect to database
await mongoose.connect(process.env.MONGO_URI);

//Create Express app
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());



// Start the notification scheduler (runs periodically as defined in cron job)
sendNotifications(); // This initializes the cron job and starts the periodic checks


//Define routes
app.use(userRouter); 
app.use(triggerRouter)
app.use(symptomRouter)
app.use(medicationRouter)
app.use(inhalerRouter)

mailtransporter.verify((error, success) => {
    if (error) {
        console.error("SMTP connection error:", error);
    } else {
        console.log("SMTP connection successful");
    }
});



//Listen to server
app.listen (3008, () => {
    console.log('App is running on port 3008')
});