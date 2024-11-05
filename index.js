import express from "express";
import mongoose from "mongoose";




//Connect to database
// await mongoose.connect(process.env.MONGO_URI);

//Create Express app
const app = express();


//Listen to server
app.listen (3008, () => {
    console.log('App is running on port 3008')
}

)