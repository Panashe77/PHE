const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const articleRoutes = require('./routes/articleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static and body parsing middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session and authentication
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Dummy authentication strategy (customize later)
passport.use(new LocalStrategy((username, password, done) => {
  if (username === 'admin' && password === 'password') {
    return done(null, { id: 1, username: 'admin' });
  }
  return done(null, false, { message: 'Invalid credentials' });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id: 1, username: 'admin' }));

// Middleware to inject loggedIn into all views
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated?.() || false;
  next();
});

// 🔍 Load and sort articles by created_at (latest first)
function getArticles() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'articles.json'), 'utf-8');
    const parsed = JSON.parse(data);
    const articles = parsed.articles || [];
    return articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (err) {
    console.error('Error loading articles:', err);
    return [];
  }
}

// 🏠 Home page
app.get('/', (req, res) => {
  const articles = getArticles();
  res.render('index', { articles });
});

// 🔗 Article routes
app.use('/articles', articleRoutes);

// 🧾 Login & Signup (basic stubs)
app.get('/login', (req, res) => {
  res.render('login', { message: null });
});

app.get('/signup', (req, res) => {
  res.render('signup', { message: null });
});

app.get('/profile', (req, res) => {
  res.send('Profile page goes here!');
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`📡 Server is running at http://localhost:${PORT}`);
});