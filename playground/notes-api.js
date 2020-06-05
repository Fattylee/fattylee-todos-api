const yargs = require("yargs");
const fs = require("fs");
const { argv } = yargs;

const {
  _: [command],
} = argv;

if (command.toLowerCase() === "add") {
  const { title = "", body = "" } = argv;
  const note = { title, body };
  const { status, msg } = addNote(note);
  if (status === "fail") {
    console.log(msg);
    return;
  }
  console.log("Adding a new note");
  console.log("-".repeat(8));
  console.log(note);
} else if (command.toLowerCase() === "list") {
  console.log("Getting all notes");
  const notes = getAllNotes();
  console.log(notes);
} else if (command.toLowerCase() === "get") {
  console.log("Get a note");
} else if (command.toLowerCase() === "remove") {
  const { title } = argv;
  const { status, msg } = removeNote(title);
  if (status === "fail") {
    console.log(msg);
    return;
  }
  console.log(msg);
} else {
  console.log(
    'Unkown command: enter one of the following commands - "add", "list, "get", "remove" '
  );
}

function removeNote(title) {
  if (!title) {
    return { status: "fail", msg: "title field is required" };
  }
  const notes = getAllNotes();

  const alreadyExist = notes.find(
    ({ title: t }) => t.toLowerCase() === title.toLowerCase()
  );
  if (!alreadyExist) {
    return { status: "fail", msg: "invalid! note not found" };
  }
  const newNotes = notes.filter(({ title: t }) => t.toLowerCase() !== title);
  fs.writeFileSync("my_list.json", JSON.stringify(newNotes));
  return { msg: "Note removed" };
}

function getAllNotes() {
  const notes = fs.readFileSync("my_list.json");
  try {
    return JSON.parse(notes);
  } catch (ex) {
    console.log(ex);
    return [];
  }
}

function addNote(note) {
  const { title, body } = note;

  if (!(title && body)) {
    return {
      status: "fail",
      msg: "required field is missing: title or body",
    };
  }
  notes = getAllNotes();
  const alreadyExist = notes.find(
    ({ title: t }) => t.toLowerCase() === title.toLowerCase()
  );
  if (alreadyExist) {
    return { status: "fail", msg: "invalid! title name already exist" };
  }
  notes.push(note);
  fs.writeFileSync("my_list.json", JSON.stringify(notes));
  return JSON.stringify(note);
}
