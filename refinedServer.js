const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const slugify = require("slugify");

const app = express();

//middlewares setup
app.use(cors()); //cors middleware to handle cross domain requests.
app.use(express.json()); //to parse the request.body as JSON object.

//connection to database
mongoose.connect("mongodb://localhost:27017/notebook");

//listening for start event of our Database
mongoose.connection.on("start", () =>
  console.log("Database Connection is established")
);

//listening for error event of our Database
mongoose.connection.on("error", (error) => console.log(error));

//schema of notes collection
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

// Creating a notes collection using noteSchema
const notes = mongoose.model("notes", noteSchema);

// Creating endpoint routes to handle requests from users or another services.

// GET Endpoint route for '/' route of Notebook Server.
app.get("/", function (req, res) {
  res.send("Notebook Backend Server is Now Available 😎.");
});

// GET Endpoint route for '/about' route of Notebook Server.
app.get("/about", function (req, res) {
  res.send(
    "This is a notebook backend server which helps you manage your notes."
  );
});

// GET Method Endpoint route for '/notes' for fetching all notes from notes collection of Notebook database.
app.get("/notes", async function (req, res) {
  try {
    const notesResponse = await notes.find({});
    if (notesResponse.length > 0) {
      res.status(200).json({ success: true, response: notesResponse });
    } else {
      res.status(404).json({ success: false, response: "No notes found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Method Endpoint route for '/create' for creating a new Note in notes collection of Notebook database.
app.post("/create", async function (req, res) {
  try {
    const { title, body, tag } = req.body;
    if (title && body && tag) {
      const slug = slugify(title);
      const existingNote = await notes.find({ slug });
      if (existingNote.length > 0) {
        res.status(400).json({
          success: false,
          response:
            "Note already exists.Please, give another title to your note.",
        });
      } else {
        const note = new notes({ title, body, tag, slug });
        const savedNote = await note.save();
        res.status(201).json({ success: true, response: savedNote });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT Method Endpoint route for '/update/:slug' for updating a Note in notes collection of Notebook database using the slug parameter.
app.put("/update/:slug", async function (req, res) {
  try {
    const slug = req.params.slug;
    if (slug) {
      const existingNote = await notes.findOne({ slug });
      if (!existingNote) {
        res.status(404).json({
          success: false,
          response: "Note not found",
        });
        return;
      }
      let newNote = {};
      const { title, body, tag } = req.body;
      if (title && body && tag) {
        if (
          existingNote.title === title ||
          existingNote.slug === slugify(title)
        ) {
          newNote.title = title;
          newNote.body = body;
          newNote.tag = tag;

          const updatedNote = await notes.findOneAndUpdate(
            { slug },
            { $set: newNote },
            { new: true }
          );
          res.status(200).json({ success: true, response: updatedNote });
        } else {
          const newSlug = slugify(title);
          const noteSlugCheck = await notes.find({ slug: newSlug });
          if (noteSlugCheck.length > 0) {
            res.status(400).json({
              success: false,
              response: "Please, give Unique Title to your Note.",
            });
          } else {
            newNote.title = title;
            newNote.body = body;
            newNote.tag = tag;
            newNote.slug = newSlug;

            const updatedNote = await notes.findOneAndUpdate(
              { slug },
              { $set: newNote },
              { new: true }
            );
            res.status(200).json({ success: true, response: updatedNote });
          }
        }
      } else {
        res.status(404).json({
          success: false,
          response: "Please Enter a give a valid slug",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE MEthod Endpoint route '/delete/:slug' to delete the note from the notes collection of NoteBook Database using the slug parameter
app.delete("/delete/:slug", async function (req, res) {
  try {
    const slug = req.params.slug;
    if (slug) {
      const deletedNote = await notes.findOneAndDelete({ slug });
      if (deletedNote) {
        res.status(200).json({ success: true, response: deletedNote });
      } else {
        res.status(404).json({
          success: false,
          response: "Note not found",
        });
        return;
      }
    } else {
      res
        .status(404)
        .json({ success: false, response: "Please Enter a give a valid slug" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Listening to the Notebook Server on port 5000.
app.listen(5000, function () {
  console.log("Server running on http://localhost:5000");
});
