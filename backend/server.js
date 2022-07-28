// importing the installed packages
const express = require('express');
const dotenv = require('dotenv');
// const { chats } = require('./data/data');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const oauth = require('./routes/oauth');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');
var cors = require('cors');


// unlocking the functions of dotenv
const app = express();
dotenv.config();
connectDB();

// creating app variable with express();

// Telling the app to accept JSON data
app.use(express.json());

// app.use(cors());

var whitelist = ['http://127.0.0.1:5500/index.html', 'https://kuchipie.github.io/orcid-registration-frontend/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/oauthData',cors(), oauth);


// ----------------------------------Deployment-------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.join(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
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