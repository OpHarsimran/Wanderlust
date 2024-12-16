if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const port = 8080;
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');//use to create layouts
const methodOverriding = require('method-override');
const expressError = require('./utils/expressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const listingRouter = require('./Routes/listing.js');
const reviewRouter = require('./Routes/review.js');
const userRouter = require('./Routes/user.js');

const dburl = process.env.ATLASDB_URL;

const User = require('./Models/user.js');

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,

    },
    touchAfter: 24 * 3600,
})
store.on("error",()=>{
    console.log("session store error",err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // setting expire date for the cookie
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}




app.use(methodOverriding('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname , '/views'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));

app.engine('ejs',ejsMate);

main().then((res)=>{
    console.log('connection to DB');
}).catch((err=>{
    console.log('error connecting to DB');
}))


async function main(){
    await mongoose.connect(dburl)
}

app.use(session(sessionOption));
app.use(flash());

//passport////
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(res,req)=>{
    res.redirect('/listings');
})

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})



app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter);

app.all('*',(req,res,next)=>{
    next(new expressError(404,'Page not found'))
})

//error-handling middleware(cleint-side handling)
app.use((err,req,res,next)=>{
    let {status=500, message="something went wrong"} = err;
    res.status(status).render('listings/error',{message});
    
})


app.listen(port,()=>{
    console.log('Server is running on port 8080');
});
