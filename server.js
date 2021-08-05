const path = require('path');
const fs = require('fs');

const express = require('express');
const { json } = require('express');

const crypto = require("crypto");

// const jsNotes =
//   [
//     // {
//     //     title:"Test Title",
//     //     text:"Test text"
//     // }
//   ];

const PORT = process.env.PORT || 3001;
const app = express();
// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Use apiRoutes
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {

  fs.readFile("./db/db.json", "utf8", function (error, jsNotes) {

    if (error) {
      return console.log(error);
    }
    console.log(jsNotes," jsNotes",error," error");
    // console.log(JSON.parse(jsNotes));
    if (jsNotes.trim() === "") {
      console.log("empty file");
      return res.json(JSON.parse("[]"));
    };
    return res.json(JSON.parse(jsNotes));
  });

});

// Create a POST route that adds new notes to db.json then returns new note to client
app.post('/api/notes', (req, res) => {
  const jsNote = req.body;
  // const jsNoteArray = [];

  const id = crypto.randomBytes(4).toString("hex");

  console.log(id);

  jsNote.id = id;

  console.log(jsNote);

  fs.readFile("./db/db.json", "utf8", function (error, jsNotes) {

    if (error) {
      return console.log(error);
    }

    // console.log(JSON.parse(jsNotes));
    const jsNoteArray = JSON.parse(jsNotes);

    jsNoteArray.push(jsNote);
    console.log(jsNoteArray);
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify( jsNoteArray , null, 2)
    );

    res.json(jsNote);

  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});