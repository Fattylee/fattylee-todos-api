const mongoose = require("mongoose");
let db = "TodoApi";
if (process.env.NODE_ENV === "test") {
  db = "test";
}
mongoose.connect("mongodb://localhost/" + db, { useNewUrlParser: true });

exports.Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
});

exports.add = (a, b) => a + b;
exports.product = (a, b) => a * b;
exports.setName = (user, fullname) => {
  const [firstname, lastname] = fullname.split(/\s+/gi);
  user[firstname] = firstname;
  user[lastname] = lastname;
  return user;
};

exports.asyncAdd = (a, b, callBack) => {
  setTimeout(() => {
    callBack(a + b);
  }, 19);
};
