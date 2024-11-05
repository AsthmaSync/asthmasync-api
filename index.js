import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js"; 




//Connect to database
await mongoose.connect(process.env.MONGO_URI);

//Create Express app
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());


//Define routes
app.use(userRouter); 


//Listen to server
app.listen (3008, () => {
    console.log('App is running on port 3008')
});