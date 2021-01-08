const jest = require("jest");
const sinon = require("sinon");
const expect = require("expect");
const request = require("supertest");
const app = require("../../playground/express");
const { Todo, add, product, setName, asyncAdd } = require("./util");

it("should sum two numbers", () => {
  const res = add(2, 1);
  // if (res !== 3) throw new Error(`Expected 3 but got ${res}`);
  expect(res).toBe(3);
});

it("should return the product of two numbers correctly", () => {
  const res = product(2, 3);
  expect(res).toBe(6);
  expect(res).not.toEqual(1);
  expect([1, 2, 3, 4, 5]).not.toEqual(expect.arrayContaining([1, 78]));
});

it("should setName correctly", () => {
  const user = setName({}, "fatai   balogun");
  expect(user).toEqual(
    expect.objectContaining({
      fatai: "fatai",
      balogun: expect.anything(),
    })
  );
});

it("should add numbers asynchronously", (done) => {
  asyncAdd(1, 2, (res) => {
    expect(res).toEqual(3);
    done();
  });
});

it("should test POST /", (done) => {
  request(app)
    .post("/")
    .expect(200)
    .expect("content-typE", /utF-8/i)
    .expect({ status: "successfully updated" })
    .expect({ status: "successfully updated" })
    .expect(({ body }) => {
      expect(body).toEqual(
        expect.objectContaining({ status: expect.stringContaining("update") })
      );
      expect(body).toEqual(
        expect.objectContaining({ status: expect.stringMatching(/suC.*ted/i) })
      );
      expect([1, 2, 3]).toEqual(expect.arrayContaining([2]));
      done();
    })
    .end(done);
});

it("should get my user info", (done) => {
  request(app)
    .get("/users")
    .expect(200)
    .expect((res) => {
      const users = res.body;
      expect(users).toEqual(
        expect.arrayContaining([
          { name: expect.stringMatching(new RegExp("Abu.*aan", "i")) },
        ])
      );
    })
    .end(done);
});

describe("Spy", () => {
  it("to av been called", () => {
    // const fn = jest.fn();
    const fn = sinon.mock();
    fn();
    // expect(fn).toHaveBeenCalled();
  });
});

describe("Todo", () => {
  beforeEach(async () => {
    const deletedTodo = await Todo.deleteMany({});
    // console.log(deletedTodo);
    // done();
  });

  const rq = (status) =>
    request(app)
      .post("/todos")
      .expect(status);

  it("should not create a todo", (done) => {
    rq(400).end((err) => {
      Todo.find()
        .then((todos) => {
          expect(todos).toEqual([]);
          done();
        })
        .catch((er) => done(er));
    });
  });

  it("should create a new todo", (done) => {
    const text = "check my slack messages";
    rq(201)
      .send({ text })
      .expect((res) => {
        expect(res.body.text).toEqual(expect.stringMatching(/my.*sl.*E/i));
      })
      .end(async (err, res) => {
        try {
          if (err) return done(err);
          const resTodo = await Todo.find();
          expect(resTodo[resTodo.length - 1]).toEqual(
            expect.objectContaining({
              text: expect.stringMatching(RegExp("messageS", "i")),
            })
          );
          expect(resTodo.length).toBe(1);
          done();
        } catch (ex) {
          console.log("Async Ex:", ex);
          done(ex);
        }
      });
  });

  it("should recieved Authorizaton token", (done) => {
    const username = "fattylee",
      password = "loocer";
    request(app)
      .post("/login")
      .send({ username, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toBe("Bearer 12345");
        // done();
      })
      .end((err, res) => done(err));
  });
});
