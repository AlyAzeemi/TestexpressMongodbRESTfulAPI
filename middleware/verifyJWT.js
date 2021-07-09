const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  jwt.verify(req.token, "secretkey", async function (err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      const _data = await jwt.decode(req.token, { complete: true, json: true });
      req.user = _data["payload"];
    }
    next();
  });
}

function ensureWebToken(req, res, next) {
  try {
    const cookieHeader = req.headers["cookie"];

    if (typeof cookieHeader !== "undefined") {
      cookies = cookieHeader.split(";");
      sortedCookies = {};
      cookies.forEach((val) => {
        let cookie = val.split("=");
        sortedCookies[`${cookie[0].trim()}`] = cookie[1];
      });
      req.token = sortedCookies.JWToken;
      console.log(sortedCookies);
      if (req.token) {
        verifyJWT(req, res, next);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    console.log(`Something terrible has happened: ${e}`);
    res.send("Internal Server Error");
  }
}

function ensureNoWebToken(req, res, next) {
  try {
    const cookieHeader = req.headers["cookie"];
    if (typeof cookieHeader !== "undefined") {
      cookies = cookieHeader.split(";");
      sortedCookies = {};
      cookies.forEach((val) => {
        let cookie = val.split("=");
        sortedCookies[`${cookie[0].trim()}`] = cookie[1];
      });
      console.log(sortedCookies);
      if (sortedCookies.JWToken) {
        res.redirect("dashboard");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    res.send("Internal Server Error");
  }
}
module.exports = { ensureWebToken, ensureNoWebToken };
