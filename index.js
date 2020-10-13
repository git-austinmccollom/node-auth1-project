const express = require("express");
const helmet = require("helmet");
const dbFun = require("./dbFunctions.js");

const server = express();
server.use(helmet());
server.use(express.json());

//CRUD
//Create / Register
server.post("/api/register", (req, res) => {});

//Read
server.get("/api/users", (req, res) => {
    dbFun.findUsers()
    .then( dbRes => {
        res.status(200).json(dbRes);
    })
    .catch( dbErr => {
        res.status(500).json(dbErr); 
    })
});

server.get("/", (req, res) => {
  res.status(200).json({ hello: "Hello World" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`API running on port ${PORT}`));
