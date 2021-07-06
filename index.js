const express = require("express");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const userAuth = require("./controllers/user-auth.js");
const { response } = require("express");
const fs = require("fs");
const cheerio = require("cheerio");

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

//Login
app.get("/login", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendFile(__dirname + "/static/login.html");
    } else {
      //TODO
      /*
      var html = fs.readFileSync(__dirname + "/static/login.html", "utf8");
      var $ = cheerio.load(html);
      var scriptNode = '<script>alert("Logout before performing this operation.");</script>';
      $("body").append(scriptNode);
      res.send($.html());
      */
      res.redirect("../dashboard");
    }
  });
});
app.post("/api/login", async (req, res) => {
  apiResp = await userAuth.login(req.body.email, req.body.password);
  if (apiResp.loginStatus) {
    await new Promise(function (resolve, reject) {
      jwt.sign({ user: apiResp.userData }, "secretkey", (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(token);
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
          });
          resolve(token);
        }
      });
    });
    res.redirect("../dashboard");
  } else {
    res.jsonp(apiResp);
  }
});

//Sign up
app.get("/signup", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendFile(__dirname + "/static/signup.html");
    } else {
      //TODO
      /*
      var html = fs.readFileSync(__dirname + "/static/signup.html", "utf8");
      var $ = cheerio.load(html);
      var scriptNode = '<script>alert("Logout before performing this operation.");</script>';
      $("body").append(scriptNode);
      //res.send($.html());
      */
      res.redirect("../dashboard");
    }
  });
});
app.post("/api/signup", async (req, res) => {
  let user = req.body;
  apiResp = await userAuth.signup(user);
  res.jsonp(apiResp);
});

//Run
app.listen(PORT, () => {
  console.log(`Up and running at http://localhost:${PORT}/`);
});

//Middleware: Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["cookie"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split("=")[1];
    console.log("req.token: " + req.token);
    req.token = bearer;
    next();
  } else {
    next();
  }
}

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

//Logout
app.post("/api/logout", verifyToken, (req, res) => {
  try {
    res.clearCookie("accessToken", req.token), { httpOnly: true };
    res.redirect("../login");
  } catch (e) {
    console.log(`Error whilst logging out user: ${e}`);
  }
});
