const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const oauth = require('./routes/oauth');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');
var cors = require('cors');

const User = require("./models/userModel");

const passport = require("passport");
const session = require("express-session");
const OrcidStrategy = require("passport-orcid").Strategy;
const axios = require("axios");
const bodyParser = require("body-parser");


// unlocking the functions of dotenv
const app = express();
dotenv.config();
connectDB();

// creating app variable with express();

// Telling the app to accept JSON data
app.use(express.json());

app.use(cors());


app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/oauthData', oauth);


// ----------------------------------Deployment-------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    // app.get("*", (req, res) =>
    //     res.sendFile(path.join(__dirname1, "frontend", "build", "index.html"))
    // );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}





// these are needed for storing the user in the session
passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  
  // add the ORCID authentication strategy
  passport.use(
    new OrcidStrategy(
      {
        state: true, // remove this if not using sessions
        clientID: "APP-RIU99EAXIMJAA7TX",
        clientSecret: "ff079043-138a-467f-9491-63899cab2ece",
        callbackURL: "https://scholar-chat-orcid.herokuapp.com/auth/orcid/callback",
      },
      function (accessToken, refreshToken, params, profile, done) {
        // `profile` is empty as ORCID has no generic profile URL,
        // so populate the profile object from the params instead
  
        profile = { orcid: params.orcid, name: params.name };
  
        return done(null, profile);
      }
    )
  );
  
//   const app = express();
  app.use(express.static(path.join(__dirname, 'public')))

  app.set('views', path.join(__dirname, 'views'));

  app.set("view engine", "ejs");
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded());
  // in latest body-parser use like below.
  app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(express.static('public'))
  
  
  
  app.use(session({ secret: "foo", resave: false, saveUninitialized: false }));
  // app.use('/files', express.static('files'))
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // show sign in or sign out link
  app.get("/hello", function (req, res) {
    if (req.isAuthenticated()) {
      res.render('index');
    } else {
      // res.send('<a href="/auth/orcid/login">Sign in with ORCID</a>')
      res.render("index");
    }
  });
  
  
  app.get("/team", function (req, res) {
    if (req.isAuthenticated()) {
      res.render('teams_page');
    } else {
      // res.send('<a href="/auth/orcid/login">Sign in with ORCID</a>')
      res.render("teams_page");
    }
  });
  
  // start authenticating with ORCID
  app.get("/auth/orcid/login", passport.authenticate("orcid"));
  
  // finish authenticating with ORCID
  app.get(
    "/auth/orcid/callback",
    passport.authenticate("orcid", {
      successRedirect: "/profile",
      failureRedirect: "/",
    })
  );
  
  // sign out
  app.get("/auth/logout", function (req, res) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  
  });
  
  let data = {};
  
  // show the authenticated user's profile data
  app.get("/profile", checkAuth, function (req, res) {
    // here a page will appear which will take input for pass
    // res.json(req.user)
    res.render("setPassword");
    data = req.user;
    // res.json(data)
  });
  
  app.get("/error", function (req, res) {
    res.render("error");
  });
  
  app.get("/success", function (req, res) {
    res.render("success");
  });
  
  let statusCode = -1;
  
  app.get("/done", function (req, res) {
    console.log('statusCode =', statusCode)
    if (statusCode != '404' & statusCode != -1) {
      res.render('success')
    }
    else {
      res.render('error')
    }
  })
  
  const createUser = async (req, res) => {
    // console.log("hit createUser");
    // console.log("user create karnewali api", req);
    data["password"] = req.body["password"];
    if (data != {}) {
        try {
          console.log("not empty");
          const { orcid, name, password } = data;
          if (!name || !orcid || !password) {
            res.status(401);
            throw new Error("Please enter all the fields");
          }
    
          const userExists = await User.findOne({ orcid });
    
          if (userExists) {
            res.status(400);
            throw new Error("User Alredy Exists");
          }
    
          const user = await User.create({
            name,
            orcid,
            password,
          });
          if(!user){
            res.status(402);
            throw new Error("Internal Server Error");
          }
          res.status(201);
          res.send("User Created Successfully");
        } catch (e) {
          res.status(402).send("Internal Server Error");
        }
      } else {
        res.status(402);
        res.send("Internal Server Error");
      }
    // console.log("data", data);
    // try {
    //   // console.log("before req");
    // //   const res = await axios.post('https://scholar-chat-orcid.herokuapp.com/api/oauthData', data);
  
    // //   const response = await axios({
    // //     method: "post",
    // //     url: "https://localhost:5000/api/oauthData",
    // //     data: data,
    // //     headers: {
    // //       "Content-Type": "application/json",
    // //     },
    // //   });

        

        
        
  
    //   // console.log("done waiting..");
    //   // console.log(`Status: ${response.status}`);
    //   statusCode = response.status
  
    //   res.send(200);
    //   // console.log('Body: ', res.data);
    // } catch (err) {
    //   // console.error("error11", err["response"]);
    //   statusCode = res.status
    //   res.send(404);
    // }
  };
  
  app.post("/sendData", createUser);
  
  function checkAuth(req, res, next) {
    if (!req.isAuthenticated()) res.redirect("/auth/orcid/login");
    return next();
  }

// ----------------------------------Deployment-------------------------------

// https://scholar-chat-orcid.herokuapp.com/
const ENDPOINT = "https://scholar-chat-orcid.herokuapp.com";
// Error handling middlewares, if in case we tried to access any undefined route
app.use(notFound);
app.use(errorHandler);

// port details in env file is imported
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT} : http://localhost:${PORT}/`.blue.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: {ENDPOINT},
    },
});

io.on('connection', (socket) => {
    // console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        // console.log('User Joined Room : '+room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) {
                return;
            }
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        })
    })

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.off("setup", () => {
        // console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})