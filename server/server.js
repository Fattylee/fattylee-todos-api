require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const Joi = require("joi");
const { ObjectID } = require("mongodb");
const path = require("path");
const cors = require("cors");

const mongoose = require("./mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const {
  logger,
  validateTodoUpdate,
  formatError,
  validateUser,
  format,
  saveLog
} = require("./../helpers/utils");
const { authenticated } = require("./middleware/authenticated");
const {
  validateTodo,
  validateTodoIdParams,
  isAdmin,
  validateKey
} = require("./middleware/validators");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (require("./config/config") === "development") app.use(logger);

/*
app.use('/', (req, res, next) => {
  res.send('<h1>Website is under maintenance</h1>');
})*/

app.use("/", express.static(path.join(__dirname, "..", "public")));

app.get("/todos", authenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ _owner: req.user._id });
    todos.reverse();
    res.status(200).send({ todos });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    res.status(500).send({ error: { message: err.message || err } });
  }
});

app.get("/todos/admin", authenticated, isAdmin, async (req, res) => {
  try {
    const todos = await Todo.find();
    todos.reverse();
    res.status(200).send({ todos });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    res.status(500).send({ error: { message: err.message || err } });
  }
});

app.get("/todos/:id", authenticated, validateTodoIdParams, async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, _owner: req.user._id }).catch(
      err => {
        throw err;
      }
    );

    if (!todo) throw { statusCode: 404, message: "todo item not found" };

    res.status(200).send({ todo });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    res
      .status(err.statusCode || 500)
      .send({ error: { message: err.message || err } });
  }
});

app.post("/todos", authenticated, validateTodo, async (req, res) => {
  try {
    const doc = await Todo.insertMany({
      text: req.payload.text,
      _owner: req.user._id
    }).catch(err => {
      throw err;
    });

    res.status(201).send({ todo: doc[0] });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    res
      .status(err.statusCode || 500)
      .send({ error: { message: err.message || err } });
  }
});

app.delete(
  "/todos/:id",
  authenticated,
  validateTodoIdParams,
  async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await Todo.findOneAndDelete({
        _id: id,
        _owner: req.user._id
      }).catch(err => {
        throw err;
      });
      if (!doc) throw { statusCode: 404, message: "Todo not found" };
      res.status(200).send(doc);
    } catch (err) {
      // save all error messages to .error.log
      saveLog(err);

      res
        .status(err.statusCode || 500)
        .send({ error: { message: err.message || err } });
    }
  }
);

app.delete("/todos/", authenticated, async (req, res) => {
  try {
    const doc = await Todo.deleteMany({ _owner: req.user._id }).catch(err => {
      throw err;
    });

    res.status(200).send({ message: "all todos deleted" });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    res
      .status(err.statusCode || 500)
      .send({ error: { message: err.message || err } });
  }
});

app.patch(
  "/todos/:id",
  authenticated,
  validateTodoIdParams,
  async (req, res) => {
    try {
      let value = await validateTodoUpdate(req.body).catch(err => {
        throw err;
      });

      const { id } = req.params;

      value.completedAt = value.completed ? new Date().getTime() : null;

      const doc = await Todo.findOneAndUpdate(
        { _id: id, _owner: req.user._id },
        value,
        { useFindAndModify: false, new: true }
      ).catch(err => {
        throw err;
      });

      if (!doc) throw { statusCode: 404, message: "Todo not found" };

      res.status(200).send({ todo: doc });
    } catch (err) {
      // save all error messages to .error.log
      saveLog(err);

      if (err.details) return res.status(400).send(formatError(err));

      res.status(err.statusCode || 500).send({
        error: {
          message: err.message || err
        }
      });
    }
  }
);

app.get("/users", authenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    users.reverse();
    res.status(200).send({ users });
  } catch (err) {
    res.send(err);
  }
});

app.delete("/users", authenticated, isAdmin, validateKey, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: true }).catch(err => {
      throw err;
    });
    const ids = users.map(user => user._id);
    await Promise.all([
      User.deleteMany({ isAdmin: false }),
      Todo.deleteMany({ _owner: { $nin: ids } })
    ]).catch(err => {
      throw err;
    });

    res.status(200).send({ message: "all non-admin users deleted" });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .send({ error: { message: err.message || err } });
  }
});

app.delete(
  "/users/:id",
  authenticated,
  isAdmin,
  validateTodoIdParams,
  validateKey,
  async (req, res) => {
    try {
      const { id: _id } = req.params;
      const user = await User.findOneAndDelete({ _id }).catch(err => {
        throw err;
      });
      if (!user) throw { statusCode: 404, message: "user not found" };
      const todos = await Todo.deleteMany({ _owner: _id }).catch(err => {
        throw err;
      });

      res.status(200).send({ message: "user deleted" });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ error: { message: err.message || err } });
    }
  }
);

app.patch(
  "/users/admin/:id",
  authenticated,
  isAdmin,
  validateTodoIdParams,
  async (req, res) => {
    try {
      const { id: _id } = req.params;

      const user = await User.findOne({ _id }).catch(err => {
        throw err;
      });

      if (!user) throw { statusCode: 404, message: "user not found" };
      if (user.isAdmin) throw { statusCode: 403, message: "already an admin" };
      user.isAdmin = true;
      await user.save().catch(err => {
        throw err;
      });

      res.status(200).send({ message: "user upgraded to admin" });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ error: { message: err.message || err } });
    }
  }
);

app.delete(
  "/users/admin/:id",
  authenticated,
  isAdmin,
  validateTodoIdParams,
  async (req, res) => {
    try {
      const { id: _id } = req.params;

      const user = await User.findOne({ _id }).catch(err => {
        throw err;
      });

      if (!user) throw { statusCode: 404, message: "user not found" };
      if (!user.isAdmin)
        throw {
          statusCode: 403,
          message: "already a user without admin priviledge"
        };
      if (_id === req.user._id.toString())
        throw {
          statusCode: 403,
          message: "requires another admin to remove admin priviledge"
        };

      user.isAdmin = false;
      await user.save().catch(err => {
        throw err;
      });

      res
        .status(200)
        .send({ message: "admin priviledge removed successfully" });
    } catch (err) {
      res
        .status(err.statusCode || 500)
        .send({ error: { message: err.message || err } });
    }
  }
);

app.post("/users", async (req, res) => {
  try {
    const value = await validateUser(req.body).catch(err => {
      throw err;
    });

    const { email } = value;
    const user = new User(value);

    const emailExist = await User.findOne({ email }).catch(err => {
      throw err;
    });

    if (emailExist) throw { message: "email already exist", statusCode: 409 };

    await user.save().catch(err => {
      throw err;
    });

    const token = await user.generateAuthToken().catch(err => {
      throw err;
    });

    res
      .status(201)
      .header("x-auth", token)
      .send({ user });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    if (err.details) return res.status(400).send(formatError(err));

    res
      .status(err.statusCode || 500)
      .send({ error: { message: err.message || err } });
  }
}); // end post /users

// private route requires a valid token
app.get("/users/auth", authenticated, (req, res) => {
  res.status(200).send(req.user);
});

app.post("/users/login", async (req, res) => {
  try {
    const payload = await validateUser(req.body).catch(err => {
      throw err;
    });
    const validUser = await User.findByCredentials(payload).catch(err => {
      throw err;
    });

    const token = await validUser.generateAuthToken().catch(err => {
      throw err;
    });

    return res
      .status(200)
      .header("x-auth", token)
      .send({ message: "login was successful", user: validUser });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    if (err.details) return res.status(400).send(formatError(err));
    res.status(err.statusCode || 500).send({ error: err.message || err });
  }
});

// remove a token aka logout
app.delete("/users/auth/token", authenticated, async (req, res) => {
  try {
    const user = await req.user.removeToken(req.header("x-auth")).catch(err => {
      throw err;
    });

    res.status(200).send({
      message: "logout was successful"
    });
  } catch (err) {
    // save all error messages to .error.log
    saveLog(err);

    res
      .status(500)
      .send({ message: err.message || err, stack: err.stack || err });
  }
});

app.all("*", (req, res) => {
  res.status(200).redirect("/404_error-web");
});

const port = process.env.PORT;

app.listen(port, () => console.log("Server running on port", port));

module.exports = app;
