/* LOAD REQUIREMENTS */
const path = require('path');
const fs = require('fs');

const express = require('express');
const { json } = require('express');

const crypto = require("crypto");
/* END LOAD REQUIREMENTS */

/* VARIABLES */
const jsNotes =
  [
    //     // {
    //     //     id:"unique note ID",
    //     //     title:"Test Title",
    //     //     text:"Test text"
    //     // }
  ];

const PORT = process.env.PORT || 3001;
const app = express();
// const apiRoutes = require('./routes/apiRoutes');
// const htmlRoutes = require('./routes/htmlRoutes');
/* END VERIABLES */

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Index route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//Load notes landing page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

//GET Route to return notes from db
app.get('/api/notes', (req, res) => {

  fs.readFile("./db/db.json", "utf8", function (error, jsNotes) {

    if (error) {
      return console.log(error);
    }

    if (jsNotes.trim() === "") {
      console.log("empty file");
      return res.json(JSON.parse("[]"));
    };
    return res.json(JSON.parse(jsNotes));
  });

});

//POST route that adds new notes to db.json then returns new note to client
app.post('/api/notes', (req, res) => {
  const jsNote = req.body;

  const id = crypto.randomBytes(4).toString("hex");

  jsNote.id = id;

  fs.readFile("./db/db.json", "utf8", function (error, jsNotes) {

    if (error) {
      return console.log(error);
    }

    const jsNoteArray = JSON.parse(jsNotes);

    jsNoteArray.push(jsNote);
    fs.writeFileSync(

      path.join(__dirname, './db/db.json'),
      JSON.stringify(jsNoteArray, null, 2)
    );

    res.json(jsNote);

  });
});

//DELETE route to deleted the selected note ID
app.delete('/api/notes/:id', (req, res) => {
  const deleteID = req.params.id;

  //Read the notes db
  fs.readFile("./db/db.json", "utf8", function (error, jsNotes) {

    if (error) {
      return console.log(error);
    }
    const jsNoteArray = JSON.parse(jsNotes);

    //Find the index of the note to delete
    let pos = jsNoteArray.findIndex(checkID);

    function checkID(inID) {
      if (inID.id === deleteID) {
        return true;
      }
    };

    //Remove the index of the found note from the array
    jsNoteArray.splice(pos, 1);

    //write the array of notes back to the note db so I can be redisplayed without the deleted note
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(jsNoteArray, null, 2)
    );

    //return the note array to be redisplayed
    res.json(jsNoteArray);
  });

});

//default page route - all unknown pages load index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//Start server
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});