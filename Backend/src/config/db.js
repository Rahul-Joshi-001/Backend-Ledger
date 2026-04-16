const mongoose = require("mongoose")

async function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Database is Successfullly connected");            
        })
        .catch(err=>{
            console.log("Databse is not Connected")
            process.exit(1)
        })
}

module.exports = connectDB