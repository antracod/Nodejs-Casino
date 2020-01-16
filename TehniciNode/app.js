  
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

var path = require("path");
const express = require('express');
const app = express()

const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const root = path.join(__dirname, '../TehniciNode/static')
const PORT = 3000;
const initializePassport = require('./passport-config')
const users = []

app.use('/assets', express.static('./static/assets'))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.engine('ejs', require('ejs').renderFile);
app.set('view-engine', 'ejs')
app.set('views', __dirname + '/static');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))




/// ROUTETS START HERE
app.get('/', checkAuthenticated, (req, res) => {
  res.render('pages/slotsmenu.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('pages/login.ejs', {
        root
    })
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('pages/register.ejs')
  })
  

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.post('/register', checkNotAuthenticated, async (req, res) => {
   
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
    alert("Hello! I am an alert box!!");
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}



app.all('*', (req, res) => {
    res.sendFile('./pages/404.html', {
        root
    })
})

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});