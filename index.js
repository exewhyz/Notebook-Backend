const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//middlewares setup
app.use(cors()); //cors middleware to handle cross domain requests.
app.use(express.json()); //to parse the request.body as JSON object.

//connection to database
mongoose.connect("mongodb://localhost:27017/notebook");

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const notes = mongoose.model("notes", noteSchema);

app.get("/notes", async function (req, res) {
  const notesResponse = await notes.find({});
  res.json(notesResponse);
});

app.post("/create", async function (req, res) {
  const { title, body, tag } = req.body;
  const slug = slugify(title);
  const note = new notes({ title, body, tag, slug });
  const savedNote = await note.save();
  res.json(savedNote);
});

app.put("/update/:slug", async function (req, res) {
  const slug = req.params.slug;
  let newNote = {};
  const { title, body, tag } = req.body;
  const previousNote = await notes.findOne({ slug });
  newNote.title = title;
  newNote.body = body;
  newNote.tag = tag;
  newNote.slug = slug;
  const updatedNote = await notes.findOneAndUpdate(
    { slug },
    { $set: newNote },
    { new: true }
  );
  res.json(updatedNote);
});

app.delete("/delete/:slug", async function (req, res) {
  const slug = req.params.slug;
  const deletedNote = await notes.findOneAndDelete({ slug });
  res.json(deletedNote);
});

app.listen(5000, function () {
  console.log("Server running on http://localhost:5000");
});
