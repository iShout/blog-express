const mongoose = require("mongoose");

class AdminOption {
  constructor(){
    this.adminSchema = mongoose.Schema({
      account: String,
      password: String,
    });
    this.Account = mongoose.model("Account", this.adminSchema);
  }

  async verifyAccount(userInfo){
    let query = await this.Account.findOne(userInfo)
    return query === null ? false:true
  }
}
module.exports = AdminOption;