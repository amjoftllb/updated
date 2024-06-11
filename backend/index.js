const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});

const  connectDb  = require("./src/db/connectDB.js");
const app = require("./app.js")

connectDb()
.then(()=>{ app.listen(process.env.PORT || 8000 ,()=>{
    console.log(`MONGO_DB_CONNECTED on port number ${process.env.PORT}` );
})})
.catch((err)=>{
    console.log("Mongo_db connection failed !!!! " , err);
})
