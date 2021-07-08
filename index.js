const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const cheerio = require("cheerio");
const { apiRoutes } = require("./routes/api-routes");
const { ensureWebToken } = require("./middleware/verifyJWT");
const path = require("path");
const helmet = require("helmet");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

//API
app.use("/api", apiRoutes);

//-----------------------------------------------GET REQUESTS-------------------------------------------------
//Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

//Login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "login.html"));

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
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "signup.html"));
});

//userDashboard
app.get("/dashboard", ensureWebToken, (req, res) => {
  res.sendFile(path.join(__dirname, "static", "dashboard.html"));
});

//Run
app.listen(PORT, () => {
  console.log(`Up and running at http://localhost:${PORT}/`);
});
