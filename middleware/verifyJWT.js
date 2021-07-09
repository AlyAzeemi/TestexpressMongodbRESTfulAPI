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
    const x_access_token = req.headers["cookie"];
    if (typeof x_access_token !== "undefined") {
      cookies = x_access_token.split("=");
      sortedCookies = {};
      for (let i = 0; i < cookies.length; i = i + 2) {
        sortedCookies[`${cookies[i]}`] = cookies[i + 1];
      }
      console.log(sortedCookies);
      req.token = sortedCookies.JWToken;
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
    const x_access_token = req.headers["cookie"];
    if (typeof x_access_token !== "undefined") {
      cookies = x_access_token.split("=");
      sortedCookies = {};
      for (let i = 0; i < cookies.length; i = i + 2) {
        sortedCookies[`${cookies[i]}`] = cookies[i + 1];
      }
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
