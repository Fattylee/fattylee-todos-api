const express = require("express");
const hbs = require("hbs");
const { Todo } = require("./utils/util");
const app = express();

app.use(express.json());
app.set("view engine", "html");
hbs.registerPartials(process.cwd() + "/views/partials");
app.engine("html", hbs.__express);

app.get("/", (req, res) => {
  // res.send("Hello world!!!");
  res.render("haleemah.html", {
    pageTitle: "Haleemah world",
    name: "Hello baby boi",
  });
});

app.put("/", (req, res) => {
  res.send({ status: "updated successfully updated" });
});

app.post("/", (req, res) => {
  res.send({ status: "successfully updated" });
});
app.get("/users", (req, res) => {
  res.send([{ name: "abu abdnaan" }, { name: "ummu abdillah" }]);
});

app.post("/todos", async (req, res) => {
  // try {
  const { text } = req.body;
  const todo = new Todo({ text });
  todo
    .save()
    .then((newTodo) => {
      res.status(201).send(newTodo);
    })
    .catch((err) => {
      // console.log("server error:", err);
      res.status(400).send({ errror: err, message: err.message });
    });
  // } catch (err) {
  //   console.log("server error:", err);
  //   res.status(400).send({ errror: err, message: err.message });
  // }
});

app.post("/login", (req, res) => {
  res
    .status(200)
    .header("x-auth", "12345")
    .set("x-auth", "Bearer 12345")
    .send({ message: "login successfully" });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server started on port", PORT));

module.exports = app;
// [coc.nvim] Error on update coc-pairs: Error: getaddrinfo ENOTFOUND reg
// [coc.nvim] Error on update coc-prettier: Error: getaddrinfo ENOTFOUND
// registry.npmjs.org
