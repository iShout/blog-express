const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AdminOption = require("../db/admin");
const { sucessResponse, failResponse } = require("../db/responsePattern");

const amdinOpt = new AdminOption();

const tokenSecret = "aTokenKey";

// 验证登录的账号和密码
router.post("/", (req, res, next) => {
  const accountInfo = req.body;
  amdinOpt.verifyAccount(accountInfo).then((result) => {
    if (result) {
      const token = jwt.sign({ aud: accountInfo.account }, tokenSecret, {
        expiresIn: "2h",
      });
      res.cookie("token", token, {
        // httpOnly: true,
        path: "/",
        secure: false,
        domain: "localhost",
        maxAge:600000,
        SameSite:'none'
      });
      const resp = JSON.parse(JSON.stringify(sucessResponse));
      res.send(resp);
    } else {
      const resp = JSON.parse(JSON.stringify(failResponse));
      resp.message = "账号或密码输入错误";
      res.send(resp);
    }
  });
});

//验证用户的token  考虑使用中间件
router.get("/verifyUser", (req, res, next) => {
  const token = req.cookies.token;
  console.log(req.cookies, "cookieNa,me");
  res.set({
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Credentials": "true",
  });
  if (token) {
    console.log(token, "??");
    const verifyRes = jwt.verify(token, tokenSecret);
    res.send({ verify: verifyRes });
  } else {
    res.send({ verify: false });
  }
});

module.exports = router;
