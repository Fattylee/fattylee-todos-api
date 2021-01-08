const mongoose = require("mongoose");
const expect = require("expect");

mongoose
  .connect("mongodb://localhost/TodoApi", { useNewUrlParser: true })
  .then((res) => console.log("Connection was successful"))
  .catch((err) => console.log("Couldnot connect to the database"));

const Todo = mongoose.model("Todo", {
  text: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: true,
  },
  completedAt: { type: Number, default: null },
});

const todo1 = new Todo({ text: "complete this module", completed: false });

const todo2 = new Todo({ text: "j", completed: false });
// Promise.all([todo1, todo2].map((t) => t.save()))
//   .then(([p, m]) => {
//     console.log("module", m, "pussy", p);
//   })
// .catch(console.log);

todo2
  .save()
  .then((res) => {
    console.log("res:", res);
  })
  .catch((err) => {
    console.log("err:", err.message);
  });

Todo.findByIdAndDelete("5ee40560090c594cf3495004")
  .then((res) => {
    console.log("deleted successful:", res);
    expect(res).toBeNull();
  })
  .catch((err) => {
    console.log("couldnot delete item", err);
  });

