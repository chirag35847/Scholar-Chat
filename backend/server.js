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
const bodyParser = require("body-parser");
const app = express();
dotenv.config();
connectDB();
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
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new OrcidStrategy(
        {
            state: true,
            clientID: "APP-RIU99EAXIMJAA7TX",
            clientSecret: "ff079043-138a-467f-9491-63899cab2ece",
            callbackURL: "https://scholar-chat-orcid.herokuapp.com/auth/orcid/callback",
        },
        function (accessToken, refreshToken, params, profile, done) {
            profile = { orcid: params.orcid, name: params.name };
            return done(null, profile);
        }
    )
);

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "foo", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/hello", function (req, res) {
    if (req.isAuthenticated()) {
        res.render('index');
    } else {
        res.render("index");
    }
});

app.get("/team", function (req, res) {
    if (req.isAuthenticated()) {
        res.render('teams_page');
    } else {
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

app.get("/profile", checkAuth, function (req, res) {
    res.render("setPassword");
    data = req.user;
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
    if (statusCode != '404' && statusCode != -1) {
        res.render('success')
    }
    else {
        res.render('error')
    }
})

const createUser = async (req, res) => {
    console.log('data', data);
    // console.log("user create karnewali api", req);
    data["password"] = req.body["password"];
    console.log('data', data);
    if (data != {}) {
        console.log(1, 'inside if')
        try {
            console.log("not empty", 'inside try');
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
            if (!user) {
                res.status(402);
                throw new Error("Internal Server Error");
            }
            res.status(201);
            res.send("User Created Successfully");
        } catch (e) {
            console.log('catch')
            console.log(e.message);
            res.status(402).send("Internal Server Error");
        }
    } else {
        console.log('else')
        res.status(402);
        res.send("Internal Server Error");
    }
};

app.post("/sendData", createUser);

function checkAuth(req, res, next) {
    if (!req.isAuthenticated()) res.redirect("/auth/orcid/login");
    return next();
}

// ----------------------------------Deployment-------------------------------

const ENDPOINT = "https://scholar-chat-orcid.herokuapp.com";
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server started on PORT ${PORT} : http://localhost:${PORT}/`.blue.bold));
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: { ENDPOINT },
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