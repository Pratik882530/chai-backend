// require ('dotenv').config({path: './env'})]
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({path: './env'})


connectDB().then(() => {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
  
}).catch((error) => {
  console.log("MongoDB connection failed !!!", error);
});






/*
import express from "express"

const app = express();

( async() => {

    try {
      await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("error: ", (error) => {
        console.log("error",error)
        throw error
      })

      app.listen(process.env.PORT, ()=>{
        console.log(`server is running on port ${process.env.PORT}`);
      })
        
    } catch (error) {
        console.error("error: ",error);
        throw error;
        
    }

})()*/