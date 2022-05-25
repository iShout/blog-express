const mongoose = require("mongoose");
class InitDatabase {
  constructor() {
    this.dbURL = "mongodb://127.0.0.1:27017/";
    this.articleSchema = mongoose.Schema({
      title: String,
      content: String,
    });
  }

  connectDB() {
    mongoose
      .connect(this.dbURL + "blogDB")
      .then((data) => {
        console.log("连接数据库完成");
      })
      .catch((err) => {
        console.log("数据库连接失败" + err);
      });
  }
  // 在数据库中插入新的文章
  insertArticle(data) {
    const Article = mongoose.model("Article", this.articleSchema);
    const anAritcle = new Article({
      title: data.title,
      content: data.content,
    });
     return anAritcle.save();
  }
  // 获取文章
  async getArticles() {
    const Article = mongoose.model("Article", this.articleSchema);
    let query = await Article.find()
    return query
  }
  // 获取某一篇文章
  async getOneArticle(title){
    const Article = mongoose.model("Article", this.articleSchema);
    let query = await Article.findOne({title:title})
    return query
  }

  //删除文章
  async deleteArticle(title){
    const Article = mongoose.model("Article", this.articleSchema);
    let query = await Article.deleteOne({title:title})
    return query
  }

  //更新文章
  async updateArticle(title,newContent){
    const Article = mongoose.model("Article", this.articleSchema);
    let query = await Article.findOneAndUpdate({title:title},{content:newContent})
    return query
  }
}
module.exports = InitDatabase;
