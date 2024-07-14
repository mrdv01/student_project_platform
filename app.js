if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const reviewsRoutes = require('./routes/reviews');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const wrapAsync = require('./utils/wrapAsync');
const projectController = require('./controllers/projects')
const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.db_url || 'mongodb://localhost:27017/student-project-platform';
const { MongoClient, ServerApiVersion } = require('mongodb');

// Database Connection
mongoose.connect(dbUrl).
then(() => {
    console.log('connection established successfully')
})
.catch((err) => {
    console.log("error in connection", err);
})



const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );
const secret = process.env.SECRET || 'thisistopsecret';
  const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error",function(e){
    console.log("session error",e);
})

const sessionconfig = {
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7

    }
}

app.use(session(sessionconfig));
app.use(flash());




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/',wrapAsync(projectController.index));

app.use('/',usersRoutes);

app.use('/projects',projectsRoutes);

app.use('/projects/:id/reviews',reviewsRoutes);






app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message) err.message='Something Went Wrong';
    res.status(statusCode).render('error',{err});

})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`listening on ${port}`)
})