
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
      name: String,
      password: String,
      avatar: String,
      gender: String,
      bio: String
});

var User = mongoose.model('User', userSchema);

module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user).exec();
  }
};