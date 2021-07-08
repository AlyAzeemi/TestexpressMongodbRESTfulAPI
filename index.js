const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const userAuth = require("./controllers/user-auth.js");
const { response } = require("express");
const fs = require("fs");
const cheerio = require("cheerio");
const postRoutes = require("./routes/post-routes");
const { ensureWebToken } = require("../middleware/verifyJWT");
const path = require("path");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
userAuth.connectToMongoDB().then(() => {
  console.log("Connected to MongoDB");
});

//Home
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

//API
app.post("/api/", postRoutes);

//Login
app.get("/login", verifyToken, (req, res) => {
  res.sendFile(path(__dirname, "static/login.html"));

  /*
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendFile(__dirname + "/static/login.html");
    } else {
      //TODO
      
      var html = fs.readFileSync(__dirname + "/static/login.html", "utf8");
      var $ = cheerio.load(html);
      var scriptNode = '<script>alert("Logout before performing this operation.");</script>';
      $("body").append(scriptNode);
      res.send($.html());
     
      res.redirect("../dashboard");
    }
     
  });
*/
});

//Sign up
app.get("/signup", ensureWebToken, (req, res) => {
  res.sendFile(path(__dirname + "/static/signup.html"));
});

//userDashboard
app.get("/dashboard", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.sendFile(__dirname + "/static/dashboard.html");
    }
  });
});

//Run
app.listen(PORT, () => {
  console.log(`Up and running at http://localhost:${PORT}/`);
});
