const path = require('path');
const fs = require('fs');

const express = require('express');
const { json } = require('express');

const crypto = require("crypto");

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


app.delete('/api/notes/:id', (req, res) => {
  const deleteID = req.params.id;

  console.log(deleteID);

  fs.readFile("./db/db.json", "utf8", function (error, jsNotes) {

    if (error) {
      return console.log(error);
    }

    const jsNoteArray = JSON.parse(jsNotes);

    console.log(jsNoteArray);
    let pos = jsNoteArray.findIndex(checkID);

    function checkID(inID) {
      if (inID.id === deleteID) {
        return true;
      }
    };
    console.log(`Index of ${deleteID} is = ` + pos);
    jsNoteArray.splice (pos,1);
    console.log(jsNoteArray);



    // for (let i = 0; i < jsNoteArray.length; i++) {
    //   if (chosen === jsNoteArray[i].routeName) {
    //     return res.json(jsNoteArray[i]);
    //   }
    // }

    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify(jsNoteArray, null, 2)
    );

    res.json(jsNoteArray);

  });

  // return res.json(false);?
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});