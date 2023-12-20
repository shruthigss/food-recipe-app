const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB connected")
})
.catch((e)=>{
    console.log(e);
})