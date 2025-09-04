const express = require('express');
const app = express();
const mongoose = require('mongoose');
const signup = require('./router/signup'); 
const login = require('./router/login');
const { collection } = require('./models/Signup');
const session = require('express-session');
const logoutRouter = require('./router/logout');
const MongoStore = require('connect-mongo');
const HomeRouter = require('./router/home');
const dashboardRouter = require('./router/dashboard');
const profileRouter = require('./router/profile');
const editProfileRouter = require('./router/editprofile');
const logout = require('./router/logout');
const loginSuccessfulRouter = require('./router/loginSuccessful');
const multer = require('multer');
const path = require('path');
const createpost=require('./router/createpost');
const postshow=require('./router/Postshow');
const AddFriend = require('./router/addfriend');
const connectionRouter = require('./router/connection');
const removefriend = require('./router/removefriend');
const addfriend = require('./router/addfriend');
const about = require('./router/about');

// =================== EJS Setup ===================
app.set('view engine', 'ejs');
app.set('views', 'views');

// =================== Multer Setup ===================
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads')); // Ensure uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

app.use(express.urlencoded({ extended: true })); // parse form data
app.use(multer({ storage, fileFilter }).single('profileImage')); // handle image upload

// =================== Static Files ===================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profile', express.static(path.join(__dirname, 'uploads')));

// =================== Database Connection ===================
const port = 3000;
mongoose
  .connect("mongodb://localhost:27017/jwtDemo")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// =================== Session Setup ===================
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/jwtDemo',
      collectionName: 'sessions',   // collection name
      ttl: 14 * 24 * 60 * 60        // 14 days in seconds
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14  // optional: 14 days in milliseconds
    }
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// =================== Routes ===================
app.use('/signup', signup);
app.use('/login', login);
app.use('/', logoutRouter);
app.use('/', HomeRouter);
app.use('/', dashboardRouter);
app.use('/', profileRouter);
app.use('/', editProfileRouter);
app.use('/', logout);
app.use('/', loginSuccessfulRouter);
app.use('/', createpost);
app.use('/', postshow);
app.use('/', AddFriend);
app.use('/', connectionRouter);
app.use('/', addfriend);
app.use('/', removefriend);
app.use('/', about);
// =================== 404 Page ===================
app.use((req, res) => {
  res.status(404).render('404', { title: "404 - Page Not Found" });
});

// =================== Start Server ===================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/signup`);
});
