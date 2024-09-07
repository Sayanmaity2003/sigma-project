if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET);

// const https = require('https');
// https.globalAgent.options.minVersion = 'TLSv1.2';

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8000;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js"); //listing route
const reviewRouter = require("./routes/review.js"); //review route
const userRouter = require("./routes/user.js"); //user route

//Database Connection
async function main(){
    await mongoose.connect(dbUrl);
}
main().then((res)=>{
    console.log("Connected to DB");
}).catch((e)=>{
    console.log(e);
});

 //Middleware setup
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use('/listings/images', express.static(path.join(__dirname, "/public/images")));
app.use(methodOverride("_method"));
// Handle missing favicon in Express by chatGPT
app.use('/favicon.ico', (req, res) => res.status(204));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600, //24 hours in seconds
});
store.on("error", ()=>{
    console.log("Error in session MONGO SESSION store", error);
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};


// app.get("/",(req, res)=>{    
//     res.send("Hi, I am root");
// });

// app.get("/demo",async(req, res)=>{
//     let fakeUser = new User({
//         email : "student1@gmail.com",
//         username : "sigmaStudent1",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//-------------------Routes--------------------
//-----------Listing Route-------------
app.use("/listings", listingRouter);
//-----------Review Route-------------
app.use("/listings/:id/reviews", reviewRouter);
//-----------User Route-------------
app.use("/", userRouter);
//-------------------Routes--------------------


//-----------Error Handling-------------
app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
})
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
});
//-----------Error Handling------------

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
});























