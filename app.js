const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const morgan = require('morgan');

//routes
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const ratingRoutes = require('./routes/ratings');

//setup DB
mongoose.connect('mongodb://localhost:27017/yelpcamp_clone');

//setting up the middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(
  expressSession({
    secret: 'i live in pakistan',
    resave: false,
    saveUninitialized: false,
  })
);
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//custom middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//setup routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/users', userRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds/:id/ratings', ratingRoutes);

//Server
app.listen(3000, () => console.log('server has started!!!'));
