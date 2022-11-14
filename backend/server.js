// Imports start
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const authRoutes = require('./routes/authRoutes')
const oauth = require('./routes/oauth')
const messageRoutes = require('./routes/messageRoutes')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const path = require('path')
var cors = require('cors')
const User = require('./models/userModel')
const passport = require('passport')
const session = require('express-session')
const OrcidStrategy = require('passport-orcid').Strategy
const bodyParser = require('body-parser')
const app = express()
// Imports end

dotenv.config() // Extracting environment variables from env file
connectDB() // Connecting to MongoDb Database

app.use(express.json()) // Defining the json as a format to exchange data in APIs

app.use(cors()) // Cors is a package used to restrict api requests from only a specific domain.
// We added this function since we experienced some cors policy error once.

app.use('/api/user', userRoutes) // Routes related to user related to Auth and Searching users.
app.use('/api/chat', chatRoutes) // Routes handling all chat features.
app.use('/api/message', messageRoutes) // Routes for sending messages and reading messages
app.use('/api/oauthData', oauth) // Route for handling data received from oauth
app.use('/api/auth', authRoutes)

// ----------------------------------Deployment Code Starts-------------------------------

const __dirname1 = path.resolve()
if (process.env.NODE_ENV === 'production') {
  // This code runs only if environment is set to production
  app.use(express.static(path.join(__dirname1, '/frontend/build'))) // This runs frontend and backend on the same port.
} else {
  app.get('/', (req, res) => {
    res.send('API is running..') // Test message from endpoint blank endpoint (www.scholarchat.org/)
  })
}

// ----------------------------------Deployment Code Ends-------------------------------

// ----------------------------------EJS and express App code starts -------------------------------

// Code below is used for authenticating with Oauth of orcid.
// This is done with a package called passport.js
// This is the documentation for that package https://www.passportjs.org/packages/passport-orcid/

// these lines are needed for storing the user in the session
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(
  new OrcidStrategy(
    {
      state: true,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        'https://scholar-chat-orcid.herokuapp.com/auth/orcid/callback',
    },
    function (accessToken, refreshToken, params, profile, done) {
      profile = { orcid: params.orcid, name: params.name }
      return done(null, profile)
    }
  )
)

app.use(express.static(path.join(__dirname, 'public'))) // setting public folder for using all assets (images, css, etc)
app.set('views', path.join(__dirname, 'views')) // setting views folder for express
app.set('view engine', 'ejs') // setting rendering engine as ejs
app.use(bodyParser.json()) // data from req.body should be converted to json when we receive data from requests
app.use(bodyParser.urlencoded({ extended: true })) // only that data will be parsed which parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(session({ secret: 'foo', resave: false, saveUninitialized: false })) // used to save data temporatily using express sessions
app.use(passport.initialize()) // passport initialization code
app.use(passport.session()) // saving data

app.get('/hello', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('index')
  } else {
    res.render('index')
  }
})

app.get('/team', function (req, res) {
  if (req.isAuthenticated()) {
    res.render('teams_page')
  } else {
    res.render('teams_page')
  }
})

// start authenticating with ORCID
app.get('/auth/orcid/login', passport.authenticate('orcid'))

// finish authenticating with ORCID
app.get(
  '/auth/orcid/callback',
  passport.authenticate('orcid', {
    successRedirect: '/profile',
    failureRedirect: '/',
  })
)

// sign out
app.get('/auth/logout', function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

let data = {}

app.get('/profile', checkAuth, function (req, res) {
  // The profile page
  res.render('setPassword')
  data = req.user
})

app.get('/error', function (req, res) {
  // The error page
  res.render('error')
})

app.get('/success', function (req, res) {
  // The successful registration page
  res.render('success')
})

let statusCode = -1 // Global variable. (Bad habit)

app.get('/done', function (req, res) {
  // Final Api hit after completing registration
  console.log('statusCode =', statusCode)
  if (statusCode != '404' && statusCode != -1) {
    res.render('success')
  } else {
    res.render('error')
  }
})

const createUser = async (req, res) => {
  // User creating API
  // console.log('data', data);
  data['password'] = req.body['password']
  // console.log('data', data);
  if (data != {}) {
    try {
      const { orcid, name, password } = data
      if (!name || !orcid || !password) {
        // check if all fields are present
        res.status(401)
        throw new Error('Please enter all the fields')
      }

      const userExists = await User.findOne({ orcid }) // Find if user already exists with same orcid

      if (userExists) {
        res.status(400)
        throw new Error('User Alredy Exists') // Throw error if user already exists
      }

      const user = await User.create({
        // Create user with the details if user doesnot exist
        name,
        orcid,
        password,
      })
      if (!user) {
        res.status(402)
        throw new Error('Internal Server Error')
      }
      res.status(201)
      res.send('User Created Successfully')
    } catch (e) {
      // Throw error
      console.log('catch')
      console.log(e.message)
      res.status(402).send('Internal Server Error')
    }
  } else {
    console.log('else')
    res.status(402)
    res.send('Internal Server Error')
  }
}

app.post('/sendData', createUser) // Create user on sendData api endpoint

function checkAuth(req, res, next) {
  // Function to check if user is authenticated
  if (!req.isAuthenticated()) res.redirect('/auth/orcid/login')
  return next()
}

// ----------------------------------EJS and express App code ends -------------------------------

// ----------------------------------Deployment-------------------------------

const ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? process.env.ENDPOINT
    : process.env.DEV_ENV
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log(
    `Server started on PORT ${PORT} : http://localhost:${PORT}/`.blue.bold
  )
)

// ----------------------------------Socket IO code starrts -------------------------------
// socket io docs https://socket.io/docs/v4/

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: { ENDPOINT },
  },
})

io.on('connection', socket => {
  // console.log("Connected to socket.io");

  socket.on('setup', userData => {
    socket.join(userData._id)
    // console.log(userData._id);
    socket.emit('connected')
  })

  socket.on('join chat', room => {
    socket.join(room)
    // console.log('User Joined Room : '+room);
  })

  socket.on('new message', newMessageRecieved => {
    var chat = newMessageRecieved.chat

    if (!chat.users) {
      return console.log('chat.users not defined')
    }

    chat.users.forEach(user => {
      if (user._id === newMessageRecieved.sender._id) {
        return
      }
      socket.in(user._id).emit('message recieved', newMessageRecieved)
    })
  })

  // code for typing indicator
  socket.on('typing', room => socket.in(room).emit('typing'))
  socket.on('stop typing', room => socket.in(room).emit('stop typing'))

  socket.off('setup', () => {
    // console.log("USER DISCONNECTED");
    socket.leave(userData._id)
  })
})

// ----------------------------------Socket IO code ends -------------------------------
