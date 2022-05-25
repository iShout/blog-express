const express = require("express");
const router = express.Router();
const InitDatabase = require("../db/connectDB");

const database = new InitDatabase();

//获取某一篇文章
router.get("/getArticleDetail", function (req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain",
  });
  database.getOneArticle(req.query.title).then((data) => {
    if(data !== null){
      res.send(data.content);
    }else{
      res.send('no articles')
    }
  });
});

//获取已有文章列表
router.get('/getArticlesList',(req,res,next)=>{
  database.getArticles().then((data) => {
    let titles = data.map(item => item.title)
    res.send(titles)
  });
})

//上传文章
router.post("/uploadArticle", (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/plain",
  });
  database
    .insertArticle(req.body)
    .then((data) => {
      res.send('上传成功');
    })
    .catch((err) => {
      res.send('保存至数据库发生异常'+err);
    });
});

//删除文章
router.delete("/deleteArticle",(req,res,next)=>{
  database.deleteArticle(req.query.title).then((data) => {
    res.send('删除完成');
  });
})

//更新文章
router.put("/updateArticle",(req,res,next)=>{
  console.log(req.cookies)
  const reqData = req.body.data
  database.updateArticle(reqData.title,reqData.content).then((data) => {
    res.send('更新完成');
  });
})

module.exports = router;
