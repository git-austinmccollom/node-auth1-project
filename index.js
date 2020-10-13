const express = require("express");
const helmet = require("helmet");
const dbFun = require("./dbFunctions.js");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const server = express();
server.use(helmet());
server.use(express.json());
server.use(
  session({
    name: "notsession", // default is connect.sid
    secret: "nobody tosses a dwarf!",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
  })
);

// Middleware

const restricted = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'You shall not pass!'});
    }
}

//CRUD
//Create / Register
server.post("/api/register", (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 10);

  credentials.password = hash;

  dbFun
    .addUser(credentials)
    .then((dbRes) => {
      res.status(200).json(dbRes);
    })
    .catch((dbErr) => {
      res.status(500).json(dbErr);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  dbFun
    .findByUsername(username)
    .first() //example has this, but I believe it is redundant with the .first() in the findBy dbFunction
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome: ${user.username}!` });
      } else {
        res.status(401).json({ error: "Incorrect credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//Read

server.get("/api/users", restricted, (req, res) => {
  dbFun
    .findUsers()
    .then((dbRes) => {
      res.status(200).json(dbRes);
    })
    .catch((dbErr) => {
      res.status(500).json(dbErr);
    });
});

// Sanity Check
server.get("/", (req, res) => {
  res.status(200).json({ hello: "Hello World" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`API running on port ${PORT}`));
