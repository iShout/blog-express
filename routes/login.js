const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const AdminOption = require("../db/admin");
const { sucessResponse, failResponse } = require("../db/responsePattern");

const adminOpt = new AdminOption();

const tokenSecret = "aTokenKey";

const CryptoJS = require("crypto-js");

// 验证登录的账号和密码
router.post("/", (req, res, next) => {
  const accountInfo = JSON.parse(CryptoJS.TripleDES.decrypt(req.body.user,'cryptoKey').toString(CryptoJS.enc.Utf8))
  adminOpt.verifyAccount(accountInfo).then((result) => {
    if (result) {
      const token = jwt.sign({ aud: accountInfo.account }, tokenSecret, {
        expiresIn: "900000",
      });
      const resp = JSON.parse(JSON.stringify(sucessResponse));
      resp.data.token = token;
      res.send(resp);
    } else {
      const resp = JSON.parse(JSON.stringify(failResponse));
      resp.message = "账号或密码输入错误";
      res.send(resp);
    }
  });
});

//验证用户的token  考虑使用中间件
router.post("/verifyUser", (req, res, next) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, tokenSecret, (err, code) => {
      if (err) {
        const resp = JSON.parse(JSON.stringify(failResponse));
        resp.message = "没有token或token已过期";
        res.send(resp);
      } else {
        const resp = JSON.parse(JSON.stringify(sucessResponse));
        resp.data = code;
        resp.message = "token验证成功";
        res.send(resp)
      }
    });
  } else {
    const resp = JSON.parse(JSON.stringify(failResponse));
    resp.message = "没有token或token已过期";
    res.send(resp);
  }
});

module.exports = router;
