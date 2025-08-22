const mongoose =require( "mongoose");

const connectDB= async()=> {
  try{
    await mongoose.connect("mongodb://localhost:27017/fsd_auth");
    console.log("MongoDB connected");
  }
  catch(error){
    console.log("Error connecting to mongodb",error.message)
  }
  
};
module.exports= connectDB;
