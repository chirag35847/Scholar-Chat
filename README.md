# Scholar-Chat
## Deployed at https://scholar-chat-orcid.herokuapp.com/

## Setup
```
npm install
nodemon backend/server.js
cd frontend
npm install
npm start
```

## Important
1. Since you are working in developing environment the express app and react app will work on different ports.
2. The express app will be working on http://localhost:5000/ and the react app will be working on http://localhost:3000/.
3. Some links will never work in this repo like the registration button on the http://localhost:3000/ page since this will try to find the localhost:3000/hello instead of localhost:5000/hello. This happens because there are two frontends, one is a react frontend and other is a ejs rendered frontend
4. The ejs rendered frontend will be available only on localhost:5000 and not on localhost:3000.

