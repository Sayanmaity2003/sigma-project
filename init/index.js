const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then((res)=>{
    console.log("Connected to DB");
}).catch((e)=>{
    console.log(e);
})

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : "669fa916db3c2f038fff8a18"}));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();